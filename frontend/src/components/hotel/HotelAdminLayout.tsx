import { Outlet } from 'react-router-dom';
import { HotelAdminSidebar } from './HotelAdminSidebar';
import { HotelAdminHeader } from './HotelAdminHeader';

export const HotelAdminLayout = () => {
  return (
    <div className="flex h-screen food-bg-light overflow-hidden">
      <HotelAdminSidebar />

      <div className="flex-1 ml-64 flex flex-col h-full overflow-hidden">
        <HotelAdminHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
