import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20 max-w-md mx-auto bg-white min-h-screen shadow-xl border-x border-gray-100">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
