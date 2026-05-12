const { OpenAI } = require('openai');

const generateReply = async (messages, config = {}) => {
  const {
    apiKey = 'ollama',
    model = "qwen2.5:3b",
    maxTokens = 1000,
    baseURL = "http://localhost:11434/v1"
  } = config;

  const openai = new OpenAI({
    apiKey,
    baseURL
  });

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.1,
      max_tokens: maxTokens
    });

    return {
      content: response.choices[0].message.content,
      tokensUsed: response.usage ? response.usage.total_tokens : 0
    };
  } catch (error) {
    console.error('Ollama/AI Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      throw new Error('AI Service Error: Không thể kết nối tới Ollama. Hãy đảm bảo Ollama đang chạy tại localhost:11434');
    }
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

module.exports = { generateReply };
