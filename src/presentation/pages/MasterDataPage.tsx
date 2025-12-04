'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { UsersTab } from '@/presentation/components/masterdata/UsersTab';
import { RolesTab } from '@/presentation/components/masterdata/RolesTab';

export const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  const tabs = [
    { id: 'users', label: 'Pengguna' },
    { id: 'roles', label: 'Role dan Hak Akses' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Master Data</h1>
          <p className="text-gray-600 mt-1">Kelola pengguna, role, dan hak akses</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-8 whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'roles' && <RolesTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};