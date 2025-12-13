import { FileText, Plus, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex flex-col items-center justify-center w-full h-full space-y-1",
      isActive ? "text-brand" : "text-gray-500 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text"
    );

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border pb-safe z-50">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        <NavLink to="/" className={navItemClass}>
          <FileText size={24} />
          <span className="text-xs font-medium">Stories</span>
        </NavLink>

        <NavLink to="/create" className={navItemClass}>
          <div className="bg-brand text-white p-2 rounded-full -mt-6 shadow-lg border-4 border-gray-50 dark:border-dark-surface">
            <Plus size={24} />
          </div>
          <span className="text-xs font-medium text-brand">New</span>
        </NavLink>

        <NavLink to="/settings" className={navItemClass}>
          <Settings size={24} />
          <span className="text-xs font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}
