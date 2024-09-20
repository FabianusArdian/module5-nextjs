import '../styles/globals.css'; // Import global styles (misalnya, Tailwind CSS atau custom CSS)
import '../styles/index.css';
import { AuthProvider } from '../context/AuthContext'; // Auth context untuk seluruh aplikasi
import Navbar from '../components/Navbar'; // Import Navbar

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <AuthProvider> {/* Pastikan AuthProvider membungkus seluruh aplikasi */}
      <Navbar /> {/* Tambahkan Navbar di sini */}
      <Component {...pageProps} /> {/* Render halaman yang sedang diakses */}
    </AuthProvider>
  );
};

export default MyApp;
