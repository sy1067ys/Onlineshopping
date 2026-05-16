import { useState, useMemo } from 'react';
import Frame1 from '../imports/Frame1';
import { ShoppingCart, Plus, Minus, X, User, LogOut } from 'lucide-react';
import LoginModal from './components/LoginModal';
import SearchBar from './components/SearchBar';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'スマートフォンケース',
    price: 2980,
    image: 'https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'おしゃれなデザインのスマートフォンケース'
  },
  {
    id: 2,
    name: 'レザーバッグ',
    price: 12800,
    image: 'https://images.unsplash.com/photo-1732613838153-00dbc88adbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: '高級感あふれる本革バッグ'
  },
  {
    id: 3,
    name: 'スリッパ',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1656103743123-b9990915d523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'カラフルで快適なルームシューズ'
  },
  {
    id: 4,
    name: 'ゴールドネックレス',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1732613839782-e89b4075d5e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'エレガントなゴールドチェーン'
  },
  {
    id: 5,
    name: 'トートバッグ',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1732613839533-ac54fcee9d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: '使いやすいデイリートート'
  },
  {
    id: 6,
    name: 'ラグジュアリーウォッチ',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'スタイリッシュな腕時計'
  },
  {
    id: 7,
    name: 'トラベルセット',
    price: 15600,
    image: 'https://images.unsplash.com/photo-1732613842479-4ff0c5031f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: '旅行に最適なアクセサリーセット'
  },
  {
    id: 8,
    name: 'クラッチバッグ',
    price: 11200,
    image: 'https://images.unsplash.com/photo-1732613842478-8a61050fe18e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'シックなクラッチバッグ'
  }
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#fdf2f8]">
      <header className="relative h-[226px] w-full">
        <Frame1 />
        <div className="absolute right-8 top-8 flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2">
                <User className="w-5 h-5 text-[#03b9f0]" />
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                title="ログアウト"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              <User className="w-5 h-5 text-[#03b9f0]" />
              <span className="text-sm">ログイン</span>
            </button>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
          >
            <ShoppingCart className="w-6 h-6 text-[#03b9f0]" />
            {totalItems > 0 && (
              <span className="bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] bg-clip-text text-transparent">
            {searchQuery ? '検索結果' : 'おすすめ商品'}
          </h2>
          {searchQuery && (
            <p className="text-gray-600">
              {filteredProducts.length}件の商品が見つかりました
            </p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">商品が見つかりませんでした</p>
            <p className="text-gray-400 text-sm">別のキーワードで検索してください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] bg-clip-text text-transparent">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    追加
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] bg-clip-text text-transparent">
                  ショッピングカート
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p>カートが空です</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="mb-1 text-sm">{item.name}</h3>
                          <p className="text-sm bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] bg-clip-text text-transparent mb-2">
                            ¥{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span>合計</span>
                    <span className="bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] bg-clip-text text-transparent">
                      ¥{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        setIsCartOpen(false);
                        setIsLoginOpen(true);
                      } else {
                        alert(`${user.name}様、ご購入ありがとうございます！合計: ¥${totalPrice.toLocaleString()}`);
                        setCart([]);
                        setIsCartOpen(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-[#ff61ad] to-[#03b9f0] text-white py-4 rounded-full hover:opacity-90 transition-opacity"
                  >
                    {user ? '購入手続きへ' : 'ログインして購入'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
