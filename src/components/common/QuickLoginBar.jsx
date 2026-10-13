import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Wrench, ShieldCheck } from 'lucide-react';

export const QuickLoginBar = () => {
  const { user, quickDemoLogin, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (role) => {
    const res = await quickDemoLogin(role);
    if (res.success) {
      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'PROVIDER') navigate('/provider/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    }
  };

  return (
    <aside aria-label="Demo Role Switcher" className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white text-xs px-4 py-2 border-b border-emerald-800/40 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Interactive Demo Mode:
          </span>
          <span className="hidden sm:inline text-slate-300">
            Switch persona instantly to explore role workflows:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRoleSwitch('FARMER')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              user?.role === 'ROLE_FARMER'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            Farmer (Ramesh)
          </button>

          <button
            onClick={() => handleRoleSwitch('PROVIDER')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              user?.role === 'ROLE_PROVIDER'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            Provider (Kisan Agro)
          </button>

          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              user?.role === 'ROLE_ADMIN'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Admin (System)
          </button>

          {user && (
            <button
              onClick={logout}
              className="text-slate-400 hover:text-white underline ml-2 text-[11px]"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
