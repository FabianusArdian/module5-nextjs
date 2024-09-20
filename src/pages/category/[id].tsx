import { useState } from 'react';
import { fetchProductsByCategory, fetchCategories } from '../../services/api';
import ProductDetail from '../../components/ProductDetail';

const ProductCategoryPage = ({ products, categories }: any) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Tambahkan pengecekan apakah `products` ada dan merupakan array */}
      {products && products.length > 0 ? (
        products.map((product: any) => (
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
        ))
      ) : (
        <p>No products found for this category.</p> // Tampilkan pesan jika tidak ada produk
      )}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} isOpen={!!selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

// Implementasi SSR untuk mengambil data produk berdasarkan kategori
export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    console.log('Fetching products for category id:', id);

    // Ambil data produk berdasarkan kategori
    const products = await fetchProductsByCategory(id);
    console.log('Products fetched:', products);

    const categories = await fetchCategories();
    console.log('Categories fetched:', categories);

    // Proses kategori untuk pemetaan
    const categoryMap: { [key: number]: string } = {};
    categories.forEach((category: any) => {
      categoryMap[category.id] = category.name;
    });

    return {
      props: {
        products: products || [], // Jika products undefined, beri nilai default []
        categories: categoryMap,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [], // Jika ada error, tetap kirim array kosong
        categories: {},
      },
    };
  }
};

export default ProductCategoryPage;
