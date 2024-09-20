import '../styles/globals.css'; // Import global styles (misalnya, Tailwind CSS atau custom CSS)
import '../styles/index.css';
import { AuthProvider } from '../context/AuthContext'; // Auth context untuk seluruh aplikasi
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <AuthProvider> {/* Pastikan AuthProvider membungkus seluruh aplikasi */}
      <div className="flex flex-col min-h-screen">
        {/* Navbar ada di bagian atas */}
        <Navbar />

        {/* Komponen utama halaman */}
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        {/* Footer ada di bagian bawah */}
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default MyApp;
