import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const login = async (email: string, password: string) => {
  try {

    const response = await axios.get(`${API_BASE_URL}/users`);
    const users = response.data;

    const user = users.find((user: any) => user.email === email && user.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: userPassword, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Invalid email or password');
  }
};


export const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  try {

    const usersResponse = await axios.get(`${API_BASE_URL}/users`);
    const users = usersResponse.data;

    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const response = await axios.post(`${API_BASE_URL}/users`, {
      name,
      email,
      password
    });

    const newUser = response.data;
    const { password: userPassword, ...userWithoutPassword } = newUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Registration failed');
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      images: product.images,
      category: product.category, 
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?category=${categoryId}`);
    return response.data.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      images: product.images,
      category: product.category, 
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
