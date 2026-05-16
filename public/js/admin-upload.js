// public/js/admin-upload.js
// 管理画面の画像アップロードと商品登録ロジック
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(uploadForm);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(()=>({ error: 'upload failed' }));
        alert(err.error || err.message || 'アップロード失敗');
        return;
      }
      const j = await res.json();
      const list = document.getElementById('uploaded-list');
      const img = document.createElement('img');
      img.src = j.url;
      img.alt = j.filename || 'uploaded';
      img.style.maxWidth = '200px';
      img.style.border = '1px solid #ddd';
      img.style.padding = '6px';
      img.style.cursor = 'pointer';
      img.title = j.filename || j.url;
      img.addEventListener('click', () => {
        const input = document.getElementById('product-image');
        if (input) input.value = j.url;
      });
      if (list) list.prepend(img);
      alert('アップロード成功');
    } catch (err) {
      console.error(err);
      alert('通信エラーが発生しました');
    }
  });
}

const productForm = document.getElementById('product-form');
if (productForm) {
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(productForm).entries());
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({ message: '商品作成失敗' }));
        alert(j.message || '商品作成失敗');
        return;
      }
      alert('商品を作成しました');
      productForm.reset();
    } catch (err) {
      console.error(err);
      alert('通信エラーが発生しました');
    }
  });
}

(async function loadProducts(){
  try {
    const res = await fetch('/api/products');
    if (!res.ok) return;
    const rows = await res.json();
    console.log('products', rows);
  } catch(e){
    console.error('products load error', e);
  }
})();
