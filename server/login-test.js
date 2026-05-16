const http = require('http');
const data = JSON.stringify({ email: 'admin@example.com', password: 'password' });
const opts = { hostname: '127.0.0.1', port: 4000, path: '/api/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
const req = http.request(opts, (res) => {
  console.log('status', res.statusCode);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => { console.log('headers', res.headers); console.log('body', body); });
});
req.on('error', e => console.error('request error', e));
req.write(data);
req.end();