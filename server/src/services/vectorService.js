const { OllamaEmbeddings } = require("@langchain/ollama");
const prisma = require("../config/prisma");

let productVectors = [];
let productCache = []; // Cache sản phẩm cho keyword search
let embeddings = null;
let useSemanticSearch = false; // Flag: có dùng được embedding thật không

/**
 * Tính toán độ tương đồng Cosine giữa 2 vector
 */
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Khởi tạo bộ nhớ sản phẩm
 */
const initVectorStore = async () => {
  try {
    console.log("[Vector] Đang tạo bộ nhớ sản phẩm...");

    const products = await prisma.product.findMany({
      where: { status: 'active' },
      include: { category: true }
    });

    // Luôn cache sản phẩm cho keyword search (fallback)
    productCache = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category?.name || 'Khác',
      description: p.description || '',
      content: `Tên: ${p.name} | Danh mục: ${p.category?.name || 'Khác'} | Giá: ${p.price} | Mô tả: ${p.description || ''}`,
      // Tạo text tìm kiếm chứa tất cả thông tin (lowercase, bỏ dấu)
      searchText: `${p.name} ${p.category?.name || ''} ${p.description || ''}`.toLowerCase(),
    }));

    // Thử dùng nomic-embed-text cho semantic search
    try {
      embeddings = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: "http://localhost:11434",
      });
      await embeddings.embedQuery("test");

      // Nếu model tồn tại, tạo vectors
      const vectors = [];
      for (const p of productCache) {
        const vector = await embeddings.embedQuery(p.content);
        vectors.push({ ...p, vector });
      }
      productVectors = vectors;
      useSemanticSearch = true;
      console.log(`[Vector] Semantic Search sẵn sàng. Đã nạp ${productVectors.length} sản phẩm.`);
    } catch (e) {
      useSemanticSearch = false;
      console.warn(`[Vector] nomic-embed-text chưa có. Dùng Keyword Search thay thế. (${productCache.length} sản phẩm)`);
      console.warn(`[Vector] Chạy "ollama pull nomic-embed-text" để bật Semantic Search.`);
    }
  } catch (error) {
    console.error("[Vector Error] Initialization failed:", error.message);
  }
};

/**
 * Keyword Search (v2) - Tìm kiếm có trọng số và lọc nhiễu
 */
const keywordSearch = (query, limit = 5) => {
  const queryLower = query.toLowerCase().trim();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);

  if (queryWords.length === 0) return [];

  const scored = productCache.map(p => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const categoryLower = p.category.toLowerCase();

    // 1. EXACT MATCH BOOST (Trọng số cao nhất)
    if (nameLower === queryLower) score += 100;
    if (queryLower.includes(nameLower)) score += 50;
    if (nameLower.includes(queryLower)) score += 30;

    // 2. TOKEN MATCHING
    queryWords.forEach((word, index) => {
      let weight = 1.0;
      // Ưu tiên từ đầu tiên (thường là brand/model)
      if (index === 0) weight = 1.5;

      if (nameLower.includes(word)) score += 10 * weight;
      if (categoryLower.includes(word)) score += 5 * weight;
      if (p.searchText.includes(word)) score += 2 * weight;
    });

    // 3. PENALTY (Trừ điểm nếu query quá ngắn mà sản phẩm quá dài - tránh false positive)
    if (queryLower.length < 5 && nameLower.length > 20) score -= 10;

    // 4. ACCESSORY PENALTY: Nếu khách tìm điện thoại (không nhắc chữ 'ốp', 'bao', 'dán') 
    // mà sản phẩm là phụ kiện -> Trừ điểm nặng
    const accessories = ["ốp", "bao da", "kính cường lực", "sạc", "tai nghe", "cáp", "dán"];
    const isAccessory = accessories.some(a => nameLower.includes(a));
    const queryMentionsAccessory = accessories.some(a => queryLower.includes(a));
    
    if (isAccessory && !queryMentionsAccessory) {
      score -= 40;
    }

    return { ...p, score };
  });

  // Lọc lấy top và áp dụng Score-Gap Filtering cơ bản cho keyword
  const results = scored
    .filter(p => p.score > 10)
    .sort((a, b) => b.score - a.score);

  if (results.length === 0) return [];

  // Score Gap: Nếu thằng đầu tiên quá vượt trội, chỉ lấy nó
  const topScore = results[0].score;
  const filtered = results.filter(p => p.score >= topScore * 0.6);

  return filtered.slice(0, limit).map(({ id, name, price, stock, content, category }) => ({ id, name, price, stock, content, category }));
};

/**
 * Tìm kiếm sản phẩm - Pipeline mới: Hybrid Search + Score Gap
 */
const searchProducts = async (query, limit = 5) => {
  try {
    if (productCache.length === 0) await initVectorStore();
    if (!query || query.length < 2) return [];

    let semanticResults = [];

    // --- PHASE 1: SEMANTIC SEARCH ---
    if (useSemanticSearch && embeddings && productVectors.length > 0) {
      try {
        const queryVector = await embeddings.embedQuery(query);
        const scoredProducts = productVectors.map(p => ({
          ...p,
          score: cosineSimilarity(queryVector, p.vector)
        }));

        // Dynamic Threshold: Lấy những thằng có score cao (>0.75)
        semanticResults = scoredProducts
          .filter(p => p.score > 0.75)
          .sort((a, b) => b.score - a.score);

        // Score Gap Filtering: Nếu thằng 1 và thằng 2 lệch nhau quá nhiều (>0.15), bỏ thằng 2
        if (semanticResults.length > 1) {
          const gap = semanticResults[0].score - semanticResults[1].score;
          if (gap > 0.15) {
            semanticResults = [semanticResults[0]];
          }
        }
      } catch (err) {
        console.error("[Vector] Semantic error:", err.message);
      }
    }

    // --- PHASE 2: KEYWORD SEARCH ---
    const keywordResults = keywordSearch(query, limit);

    // --- PHASE 3: HYBRID MERGE & DEDUPLICATE ---
    // Ưu tiên Semantic nếu score cực cao (>0.85), nếu không thì merge với Keyword
    const finalMap = new Map();

    // Add semantic first
    semanticResults.forEach(p => finalMap.set(p.id, { ...p, source: 'semantic' }));

    // Add keyword (overwrite or add)
    keywordResults.forEach(p => {
      if (!finalMap.has(p.id)) {
        finalMap.set(p.id, { ...p, source: 'keyword' });
      }
    });

    const finalResults = Array.from(finalMap.values())
      .slice(0, limit)
      .map(({ id, name, price, stock, content }) => ({ id, name, price, stock, content }));

    console.log(`[Vector] Query: "${query}" | Results: ${finalResults.length} | Top: ${finalResults[0]?.name || 'NONE'}`);
    return finalResults;
  } catch (error) {
    console.error("[Vector Error] Search failed:", error.message);
    return keywordSearch(query, limit);
  }
};

module.exports = { initVectorStore, searchProducts };
