'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/presentation/composables/useLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { getCurrentUser } = useLogin();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      // Tidak ada user, redirect ke login
      router.push('/login');
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};