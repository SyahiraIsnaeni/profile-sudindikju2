import { PengumumanList } from '@/components/dashboard/pengumuman/PengumumanList';
import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/presentation/components/shared/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function PengumumanPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <PengumumanList />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
