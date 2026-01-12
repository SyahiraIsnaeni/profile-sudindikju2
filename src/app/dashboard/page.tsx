import { DashboardPage } from '@/presentation/pages/DashboardPage';
import { StatsCards } from '@/components/dashboard/StatsCards';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return <DashboardPage stats={<StatsCards />} />;
}