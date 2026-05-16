const express = require('express');
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
const DB_PATH = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(DB_PATH);

// =============================
// Gmail設定 ※ここを自分のGmailに変更してください
// =============================
const GMAIL_USER = 'あなたのGmailアドレス@gmail.com';  // 送信元Gmailアドレス
const GMAIL_PASS = 'アプリパスワード16桁';              // Googleアプリパスワード

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

async function sendWelcomeMail(toEmail, toName) {
  try {
    await transporter.sendMail({
      from: `"YOICHI STORE" <${GMAIL_USER}>`,
      to: toEmail,
      subject: '【YOICHI STORE】会員登録が完了しました',
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f8fb;border-radius:12px">
          <h2 style="color:#111;margin-bottom:8px">YOICHI STORE</h2>
          <p style="color:#374151;font-size:1rem">
            ${toName} 様、会員登録が完了しました！<br>
            これからもYOICHI STOREをよろしくお願いします。
          </p>
          <div style="margin:24px 0;padding:18px 20px;background:#fff;border-radius:10px;border:1px solid #e5e7eb">
            <p style="margin:0;color:#6b7280;font-size:0.9rem">登録メールアドレス</p>
            <p style="margin:4px 0 0;font-weight:700;color:#111">${toEmail}</p>
          </div>
          <a href="http://localhost:4000/index.html" style="display:inline-block;background:#111827;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">
            ショップを見る
          </a>
          <p style="margin-top:24px;font-size:0.8rem;color:#9ca3af">© YOICHI STORE</p>
        </div>
      `,
    });
    console.log('Welcome mail sent to', toEmail);
  } catch (e) {
    console.error('Mail send error:', e.message);
  }
}

// --- DBテーブル初期化 ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    items TEXT,
    total INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// --- multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// --- ミドルウェア ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: 'change_this_secret',
  resave: false,
  saveUninitialized: false,
}));

// =============================
// 管理者ログイン
// =============================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing fields' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'invalid credentials' });
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ ok: true });
  });
});

// =============================
// 一般ユーザー 新規登録
// =============================
app.post('/api/user/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: '全項目を入力してください' });
  if (password.length < 6) return res.status(400).json({ error: 'パスワードは6文字以上にしてください' });

  const hash = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hash, 'user'],
    async function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'このメールアドレスは既に登録されています' });
        return res.status(500).json({ error: err.message });
      }
      // 登録完了メールを送信
      await sendWelcomeMail(email, name);
      res.json({ ok: true, id: this.lastID });
    }
  );
});

// =============================
// 一般ユーザー ログイン
// =============================
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'メールとパスワードを入力してください' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'メールアドレスまたはパスワードが違います' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'メールアドレスまたはパスワードが違います' });
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at }
    });
  });
});

// =============================
// 注文履歴取得
// =============================
app.get('/api/user/orders', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'ログインが必要です' });
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// =============================
// 商品API
// =============================
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const { title, price, description } = req.body;
  const image = req.file ? req.file.filename : null;
  db.run('INSERT INTO products (title, price, description, image) VALUES (?, ?, ?, ?)',
    [title, price, description, image],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const { title, price, description } = req.body;
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;
  const sql = image
    ? 'UPDATE products SET title=?, price=?, description=?, image=? WHERE id=?'
    : 'UPDATE products SET title=?, price=?, description=? WHERE id=?';
  const params = image ? [title, price, description, image, id] : [title, price, description, id];
  db.run(sql, params, err => err ? res.status(500).json({ error: err.message }) : res.json({ ok: true }));
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});


// =============================
// 注文保存
// =============================
app.post('/api/orders', (req, res) => {
  const { info, items, total } = req.body || {};
  const userId = req.session.user ? req.session.user.id : null;
  if (!items || !total) return res.status(400).json({ error: 'missing fields' });
  db.run(
    'INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)',
    [userId, items, total],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

// --- エラーハンドラ ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'internal error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
