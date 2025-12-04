'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginForm {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number | null;
}

export const useLogin = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace dengan actual API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Untuk sekarang, simulasi dengan localStorage
      const mockUsers = [
        {
          id: 1,
          name: 'Admin Sudin',
          email: 'admin@gmail.com',
          role_id: 1,
        },
        {
          id: 2,
          name: 'User Sudin',
          email: 'user@gmail.com',
          role_id: 3,
        },
      ];

      const foundUser = mockUsers.find((u) => u.email === formData.email);

      if (!foundUser) {
        throw new Error('User not found');
      }

      // Store user di localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);

      // Redirect ke dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    user,
    logout,
    getCurrentUser,
  };
};