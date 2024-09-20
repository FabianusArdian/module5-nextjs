import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: number;
  name: string;
}

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetchCategories()
      .then((categories) => setCategories(categories.slice(0, 5)))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cartItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0));
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md w-[80%] mx-auto p-4 mb-6 rounded-md">
      <div className="flex justify-between items-center">
        <Link href="/" passHref>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 cursor-pointer">
            HaHa Store
          </span>
        </Link>

        <div className="hidden sm:flex space-x-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <span className="text-gray-800 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-sm font-medium cursor-pointer">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={toggleDarkMode}
            className="text-gray-800 dark:text-gray-300 hover:text-yellow-500 transition duration-300"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          <Link href="/cart">
            <span className="relative text-gray-800 dark:text-gray-300 hover:text-blue-500 transition duration-300 cursor-pointer">
              🛒
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1">
                  {cartCount}
                </span>
              )}
            </span>
          </Link>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-gray-800 dark:text-gray-300 hover:text-red-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <span className="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition duration-300 cursor-pointer">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
