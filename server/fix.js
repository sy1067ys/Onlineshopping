const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
  db.run('ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ""', err => {
    console.log('name:', err ? err.message : '追加完了');
  });
  db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"', err => {
    console.log('role:', err ? err.message : '追加完了');
    db.close();
  });
});