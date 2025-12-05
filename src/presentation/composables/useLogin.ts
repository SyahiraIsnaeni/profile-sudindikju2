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
  status: number;
}

interface LoginResponse {
  success: boolean;
  user: User;
  message: string;
}

export const useLogin = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Simpan user data di localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Set auth token di cookie (via API call)
      await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: data.user.id }),
      });

      setUser(data.user);
      setSuccess(`${data.message} Selamat datang, ${data.user.name}!`);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Login gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear auth token via API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      localStorage.removeItem('user');
      setUser(null);

      // Hard redirect ke login (clear browser cache)
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback jika API error
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
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
    success,
    user,
    logout,
    getCurrentUser,
  };
};