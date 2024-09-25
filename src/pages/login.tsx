import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { loginUser } = useAuth(); // Mengambil loginUser dari context

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const user = await login(values.email, values.password); // Panggil API login
        loginUser(user); // Kirim objek user ke loginUser
        router.push('/'); // Arahkan ke halaman utama setelah login sukses
      } catch (error) {
        console.error('Error logging in:', error); // Tangani error jika login gagal
      }
    },
  });

  return (
    <div className="flex justify-center">
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        <input
          type="email"
          id="email"
          {...formik.getFieldProps('email')}
          placeholder="Email"
          className={`border p-3 mb-4 w-full rounded-lg ${
            formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.email}</div>
        )}

        <input
          type="password"
          id="password"
          {...formik.getFieldProps('password')}
          placeholder="Password"
          className={`border p-3 mb-4 w-full rounded-lg ${
            formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.password}</div>
        )}

        <button type="submit" className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition-colors">
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register">
              <span className="text-blue-500 hover:underline cursor-pointer">Register here</span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
