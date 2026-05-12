const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../chat_logs.json');

/**
 * Lưu log tin nhắn vào file JSON
 */
const saveChatLog = (data) => {
  try {
    let logs = [];
    if (fs.existsSync(LOG_FILE)) {
      const content = fs.readFileSync(LOG_FILE, 'utf8');
      logs = JSON.parse(content || '[]');
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      ...data
    };

    logs.push(logEntry);

    // Chỉ giữ lại 1000 tin nhắn gần nhất để file không quá nặng
    if (logs.length > 1000) logs.shift();

    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf8');
  } catch (error) {
    console.error('[Logger Error] Failed to save chat log:', error.message);
  }
};

module.exports = { saveChatLog };
