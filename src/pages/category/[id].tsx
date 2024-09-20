import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchProductsByCategory, fetchCategories } from '../../services/api';
import ProductDetail from '../../components/ProductDetail';

const ProductCategoryPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (id) {
      fetchProductsByCategory(id as string)
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
    }
  }, [id]);

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
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm"
        >
          <img
            src={product.image || product.images[0]}
            alt={product.title}
            className="w-full h-56 object-cover rounded-md mb-4 transform hover:scale-105 transition-transform duration-300"
          />
          <h3 className="text-blue-600 text-lg font-bold">{product.title}</h3>
          <p className="text-gray-500 text-sm">{categories[product.category]}</p>
          <p className="text-green-600 font-bold mt-2">${product.price}</p>
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

export default ProductCategoryPage;
