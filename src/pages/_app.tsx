import '../styles/globals.css';
import '../styles/index.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <AuthProvider> 
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
};

export default MyApp;
