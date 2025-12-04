'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { useLogin } from '@/presentation/composables/useLogin';

export const DashboardPage = () => {
  const { getCurrentUser } = useLogin();
  const user = getCurrentUser();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-blue-600">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user?.name}!
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Anda login sebagai{' '}
            <span className="font-semibold">{user?.email}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
                  Total Users
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  42
                </p>
              </div>
              <div className="text-4xl text-blue-500 opacity-20">👥</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
                  Artikel
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  18
                </p>
              </div>
              <div className="text-4xl text-green-500 opacity-20">📄</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
                  Program
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  7
                </p>
              </div>
              <div className="text-4xl text-orange-500 opacity-20">🎯</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm md:text-base font-medium">
                + Tambah User
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition text-sm md:text-base font-medium">
                + Tambah Artikel
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition text-sm md:text-base font-medium">
                + Tambah Program
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">User baru didaftarkan</span>
                <span className="text-xs text-gray-400">2 jam lalu</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Artikel dipublikasikan</span>
                <span className="text-xs text-gray-400">5 jam lalu</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Program diperbarui</span>
                <span className="text-xs text-gray-400">1 hari lalu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};