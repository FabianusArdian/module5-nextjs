import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { login } from '../services/api'; // Your login service
import { useAuth } from '../context/AuthContext'; // Auth context for login state
import Link from 'next/link'; // Import Link for navigation

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { loginUser } = useAuth(); // Function from AuthContext

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
        const data = await login(values.email, values.password); // Call login API
        localStorage.setItem('token', data.token); // Save the token
        loginUser(); // Update context and login state
        router.push('/'); // Redirect to home page
      } catch (error) {
        console.error('Error logging in:', error);
      }
    },
  });

  return (
    <div className="flex justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm "
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        {/* Email Field */}
        <input
          type="email"
          id="email"
          {...formik.getFieldProps('email')}
          placeholder="Email"
          className={`border p-3 mb-4 w-full rounded-lg ${
            formik.touched.email && formik.errors.email
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.email}</div>
        )}

        {/* Password Field */}
        <input
          type="password"
          id="password"
          {...formik.getFieldProps('password')}
          placeholder="Password"
          className={`border p-3 mb-4 w-full rounded-lg ${
            formik.touched.password && formik.errors.password
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mb-4">{formik.errors.password}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-3 rounded-lg w-full hover:bg-blue-600 transition-colors"
        >
          Login
        </button>

        {/* Link to Register */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" passHref>
              <span className="text-blue-500 hover:underline cursor-pointer">Register here</span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
