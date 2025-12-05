'use client';

import { useLogin } from '@/presentation/composables/useLogin';
import Image from 'next/image';
import { Alert } from '@/presentation/components/shared/Alert';

export const LoginForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    success,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Alert Container */}
        <div className="mb-6 space-y-3">
          {success && (
            <Alert
              type="success"
              message={success}
              duration={4000}
            />
          )}
          {error && (
            <Alert
              type="error"
              message={error}
              duration={5000}
            />
          )}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo_sudindikju2-removebg.png"
                alt="Sudin Pendidikan Logo"
                width={80}
                height={80}
                priority
                className="rounded-lg shadow-md"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Suku Dinas Pendidikan
            </h1>
            <p className="text-gray-600">Wilayah II Jakarta Utara</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600"
              >
                Ingat saya
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              {loading ? 'Sedang login...' : 'Login'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">
              Email: admin@gmail.com
            </p>
            <p className="text-xs text-gray-500">
              Password: admin123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};