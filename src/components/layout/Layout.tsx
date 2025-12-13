import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <main className="pb-20 max-w-md mx-auto bg-white dark:bg-dark-surface min-h-screen shadow-xl border-x border-gray-100 dark:border-dark-border">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
