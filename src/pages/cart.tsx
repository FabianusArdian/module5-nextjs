import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth(); // Import and use isAuthenticated from AuthContext

  useEffect(() => {
    if (isAuthenticated) {
      const storedCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(storedCartItems);
    }
  }, [isAuthenticated]);

  const handleRemoveItem = (id: number) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleIncreaseQuantity = (id: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleDecreaseQuantity = (id: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleCheckout = () => {
    alert('Items will be shipped shortly!');
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-grow bg-white p-8 shadow-md rounded-md w-[80%] mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <p className="text-red-500">You must be logged in to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-white p-8 shadow-md rounded-md w-[80%] mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3">Image</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">${item.price}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cartItems.length > 0 && (
        <>
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">
              Total: $
              {cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white p-3 rounded mt-4 hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
