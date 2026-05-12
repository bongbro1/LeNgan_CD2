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
 * Keyword Search (fallback) - tìm sản phẩm bằng từ khóa
 */
const keywordSearch = (query, limit = 5) => {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);

  const scored = productCache.map(p => {
    let score = 0;

    // Exact match trong tên (điểm cao nhất)
    if (p.name.toLowerCase().includes(queryLower)) score += 10;

    // Từng từ khóa match
    for (const word of queryWords) {
      if (p.name.toLowerCase().includes(word)) score += 5;
      if (p.category.toLowerCase().includes(word)) score += 3;
      if (p.searchText.includes(word)) score += 1;
    }

    return { ...p, score };
  });

  return scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ id, name, price, content, category }) => ({ id, name, price, content, category }));
};

/**
 * Tìm kiếm sản phẩm - tự động chọn Semantic hoặc Keyword
 */
const searchProducts = async (query, limit = 5) => {
  try {
    if (productCache.length === 0) await initVectorStore();

    // Nếu có semantic search → dùng
    if (useSemanticSearch && embeddings && productVectors.length > 0) {
      const queryVector = await embeddings.embedQuery(query);
      const scoredProducts = productVectors.map(p => ({
        ...p,
        score: cosineSimilarity(queryVector, p.vector)
      }));
      return scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ id, name, price, content }) => ({ id, name, price, content }));
    }

    // Fallback → Keyword Search
    return keywordSearch(query, limit);
  } catch (error) {
    console.error("[Vector Error] Search failed:", error.message);
    // Ultimate fallback: keyword
    return keywordSearch(query, limit);
  }
};

module.exports = { initVectorStore, searchProducts };
