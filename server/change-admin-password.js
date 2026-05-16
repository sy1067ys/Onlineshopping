const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(DB_PATH);

const newPassword = process.argv[2];
if (!newPassword) {
  console.error('使い方: node change-admin-password.js 新しいパスワード');
  process.exit(1);
}

const hash = bcrypt.hashSync(newPassword, 10);
db.run('UPDATE users SET password = ? WHERE email = ?', [hash, 'admin@example.com'], function(err) {
  if (err) {
    console.error('エラー:', err.message);
  } else {
    console.log('パスワードを更新しました。');
  }
  db.close();
});
