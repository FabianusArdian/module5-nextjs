import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { loginUser } = useAuth(); // Mengambil loginUser dari context
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State untuk pesan error

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setErrorMessage(null); // Reset error message

        const user = await register({
          name: values.name,
          email: values.email,
          password: values.password,
        });

        loginUser(user); // Kirim objek user ke loginUser setelah registrasi berhasil
        router.push('/'); // Arahkan ke halaman utama
      } catch (error: any) {
        if (error.message.includes('Email already exists')) {
          setErrorMessage('Email is already registered.');
        } else {
          setErrorMessage('Failed to register. Please try again.');
        }
      }
    },
  });

  return (
    <div className="flex justify-center">
      <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto p-4 border rounded bg-white shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

        <input
          type="text"
          id="name"
          {...formik.getFieldProps('name')}
          placeholder="Name"
          className={`border p-2 mb-4 w-full rounded ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.name}</div>
        )}

        <input
          type="email"
          id="email"
          {...formik.getFieldProps('email')}
          placeholder="Email"
          className={`border p-2 mb-4 w-full rounded ${
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
          className={`border p-2 mb-4 w-full rounded ${
            formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.password}</div>
        )}

        <input
          type="password"
          id="confirmPassword"
          {...formik.getFieldProps('confirmPassword')}
          placeholder="Confirm Password"
          className={`border p-2 mb-4 w-full rounded ${
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.confirmPassword}</div>
        )}

        <button type="submit" className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600 transition-colors">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
