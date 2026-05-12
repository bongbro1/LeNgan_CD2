const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Vui lòng cung cấp mật khẩu để mã hóa.');
  console.log('Cách dùng: node hash.js <mat_khau_cua_ban>');
  process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Lỗi khi mã hóa:', err);
    return;
  }
  console.log('--------------------------------------------------');
  console.log('Mật khẩu gốc:', password);
  console.log('Mật khẩu đã mã hóa (Hash):');
  console.log(hash);
  console.log('--------------------------------------------------');
  console.log('Bạn có thể copy đoạn mã trên để dán vào cột password trong MySQL.');
});
