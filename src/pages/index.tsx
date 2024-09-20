import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductDetail from '../components/ProductDetail';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState<{ [key: number]: string }>({});
  const { isAuthenticated } = useAuth(); 

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setProducts(products);
        return fetchCategories();
      })
      .then((categories) => {
        const categoryMap: { [key: number]: string } = {};
        categories.forEach((category: any) => {
          categoryMap[category.id] = category.name;
        });
        setCategories(categoryMap);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600"
        >
          <img
            src={product.image || product.images[0]}
            alt={product.title}
            className="w-full h-56 object-cover rounded-md mb-4 transform hover:scale-105 transition-transform duration-300"
          />
          <h3 className="text-blue-600 text-lg font-bold">{product.title}</h3>
          <p className="text-gray-500 text-sm">{categories[product.category]}</p>
          <p className="text-green-600 font-bold">${product.price}</p>
          <button
            onClick={() => handleProductClick(product)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            View Details
          </button>
        </div>
      ))}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} isOpen={!!selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default HomePage;
