'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/presentation/components/shared/ProtectedRoute';
import { useLogin } from '@/presentation/composables/useLogin';

interface DashboardPageProps {
  stats?: React.ReactNode;
}

export const DashboardPage = ({ stats }: DashboardPageProps) => {
  const { getCurrentUser } = useLogin();
  const user = getCurrentUser();

  return (
    <ProtectedRoute>
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

          {/* Stats Cards (Injected from Server) */}
          {stats}

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
    </ProtectedRoute>
  );
};