import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Compass,
  User,
  Users,
  Grid,
  CheckSquare,
  DollarSign,
  Search,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isFarmer, isProvider, isAdmin } = useAuth();

  const farmerNav = [
    { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'Browse Services', path: '/catalog', icon: Compass },
    { name: 'Book New Service', path: '/farmer/book', icon: PlusCircle },
    { name: 'My Requests & Orders', path: '/farmer/requests', icon: ClipboardList },
    { name: 'Track Request', path: '/track', icon: Search },
    { name: 'Farm Profile', path: '/farmer/profile', icon: User },
  ];

  const providerNav = [
    { name: 'Dashboard & Stats', path: '/provider/dashboard', icon: LayoutDashboard },
    { name: 'Available Job Pool', path: '/provider/queue', icon: CheckSquare },
    { name: 'My Active Services', path: '/provider/active-jobs', icon: ClipboardList },
    { name: 'Completed Job History', path: '/provider/history', icon: BarChart3 },
    { name: 'Agency Profile', path: '/provider/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Service Requests', path: '/admin/requests', icon: ClipboardList },
    { name: 'Service Catalog & Pricing', path: '/admin/catalog', icon: Grid },
    { name: 'Farmers & Providers', path: '/admin/users', icon: Users },
  ];

  const currentNav = isAdmin ? adminNav : isProvider ? providerNav : farmerNav;

  return (
    <aside aria-label="Sidebar navigation" className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="mb-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Administration Portal' : isProvider ? 'Service Provider Portal' : 'Farmer Portal'}
          </div>
          <div className="font-bold text-sm text-slate-800 truncate mt-0.5">
            {user?.name}
          </div>
        </div>

        <nav aria-label="Portal Navigation" className="space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-farm-600 text-white shadow-sm shadow-farm-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 text-xs">
        <div className="font-bold text-farm-900 flex items-center gap-1.5 mb-1">
          <ShieldAlert className="w-3.5 h-3.5 text-farm-600" />
          Farmer Support
        </div>
        <p className="text-farm-800 text-[11px] leading-relaxed">
          Toll-Free Agricultural Assistance Line: <span className="font-bold">1800-180-1551</span>
        </p>
      </div>
    </aside>
  );
};
