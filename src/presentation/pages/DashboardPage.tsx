'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { useLogin } from '@/presentation/composables/useLogin';

export const DashboardPage = () => {
  const { getCurrentUser } = useLogin();
  const user = getCurrentUser();

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Anda login sebagai{' '}
            <span className="font-semibold capitalize">{user?.email}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-medium">Articles</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
            <h3 className="text-gray-600 text-sm font-medium">Programs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">7</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};