import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/menu', label: 'Menu', icon: '🥐' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/settings', label: 'Website Settings', icon: '⚙️' },
  { to: '/admin/change-password', label: 'Change Password', icon: '🔒' },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-cream-50 dark:bg-bakery-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-bakery-100 bg-white transition-transform dark:border-bakery-800 dark:bg-bakery-800 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-bakery-100 p-5 dark:border-bakery-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bakery-600 text-white">
            🥐
          </span>
          <div>
            <p className="font-display text-sm font-bold text-bakery-900 dark:text-cream-50">
              {settings?.businessName || 'Bakery Admin'}
            </p>
            <p className="text-xs text-bakery-500 dark:text-cream-300/60">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-bakery-600 text-white'
                    : 'text-bakery-700 hover:bg-bakery-100 dark:text-cream-200 dark:hover:bg-bakery-700'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-bakery-100 p-4 dark:border-bakery-800">
          <p className="mb-2 truncate text-xs text-bakery-500 dark:text-cream-300/60">
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="flex items-center justify-between border-b border-bakery-100 bg-white px-6 py-4 dark:border-bakery-800 dark:bg-bakery-800 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-bakery-700 dark:text-cream-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display font-bold text-bakery-900 dark:text-cream-50">
            Admin Panel
          </span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
