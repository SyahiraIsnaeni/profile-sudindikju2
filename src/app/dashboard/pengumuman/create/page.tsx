import { PengumumanForm } from '@/components/dashboard/pengumuman/PengumumanForm';
import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/presentation/components/shared/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function CreatePengumumanPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Buat Pengumuman Baru</h1>
                    <p className="text-slate-600">Buat pengumuman atau berita baru untuk ditampilkan di halaman depan.</p>
                </div>
                <PengumumanForm />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
