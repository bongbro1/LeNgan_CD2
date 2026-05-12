const app = require('./app');
const { initVectorStore } = require('./services/vectorService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Khởi tạo bộ nhớ AI ngay khi bật server
  await initVectorStore();
});
