import { calculateStats } from '../../utils/adminHelpers';
import { mockTenants } from '../../data/mockAdminData';

interface AdminHeaderProps {
  title: string;
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  const stats = calculateStats(mockTenants);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">System Online</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-blue-600 text-lg">{stats.total}</p>
              <p className="text-gray-500 text-xs">Total Tenants</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-600 text-lg">{stats.active}</p>
              <p className="text-gray-500 text-xs">Active</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
