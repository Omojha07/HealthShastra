'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Pill,
  DollarSign,
  Package,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Patients', href: '/patients' },
  { icon: Calendar, label: 'Appointments', href: '/appointments' },
  { icon: Stethoscope, label: 'Doctors', href: '/doctors' },
  { icon: Pill, label: 'Prescriptions', href: '/prescriptions' },
  { icon: DollarSign, label: 'Billing', href: '/billing' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 z-40 lg:z-30 lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 pt-4 lg:pt-0">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-900 text-xl font-bold">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">HMS</h1>
              <p className="text-xs text-blue-200">Hospital Management</p>
            </div>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="bg-blue-800 hover:bg-blue-700 rounded-xl p-4 transition-colors">
              <p className="font-semibold text-sm text-white truncate">{user.full_name}</p>
              <p className="text-xs text-blue-200 capitalize mt-1">{user.user_type}</p>
            </div>
          )}

          {/* Navigation - Grows to fill space */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-white text-blue-900 font-semibold shadow-md'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`transition-transform group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : ''
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button - Sticky at bottom */}
          <div className="mt-auto pt-4 border-t border-blue-700">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white border-0 gap-2 justify-center"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
