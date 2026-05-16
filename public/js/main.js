document.addEventListener('click', (e) => {
  if (e.target.matches('.add-cart')) {
    const btn = e.target;
    const id = btn.dataset.id;
    const title = btn.dataset.title || '';
    const price = btn.dataset.price || 0;
    const image = btn.dataset.image || '';
    const cart = JSON.parse(localStorage.getItem('yoichi_cart') || '[]');
    cart.push({ id, title, price, image });
    localStorage.setItem('yoichi_cart', JSON.stringify(cart));
    alert('カートに追加しました');
  }
});
