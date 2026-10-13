import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Sprout, 
  Bell, 
  User, 
  LogOut, 
  Compass, 
  LayoutDashboard, 
  ClipboardList, 
  Search,
  CheckCircle,
  Clock,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isFarmer, isProvider, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isProvider) return '/provider/dashboard';
    return '/farmer/dashboard';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-farm-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-farm-800 via-farm-600 to-emerald-600 bg-clip-text text-transparent">
                  FarmAssist
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Agri Request Management
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/catalog"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-farm-700 hover:bg-farm-50 transition"
              >
                <Compass className="w-4 h-4" />
                Services Catalog
              </Link>

              <Link
                to="/track"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-farm-700 hover:bg-farm-50 transition"
              >
                <Search className="w-4 h-4" />
                Track Request
              </Link>

              {user && (
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-farm-700 hover:bg-farm-50 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-farm-700 hover:bg-slate-100 transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown Drawer */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <span className="font-bold text-sm text-slate-800">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-farm-600 hover:text-farm-700 font-semibold"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                if (n.linkUrl) navigate(n.linkUrl);
                                setShowNotifications(false);
                              }}
                              className={`p-3 text-xs cursor-pointer transition hover:bg-slate-50 ${
                                !n.isRead ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold ${!n.isRead ? 'text-farm-800' : 'text-slate-700'}`}>
                                  {n.title}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-snug">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-farm-700 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left pr-1">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        {isFarmer ? '🌾 Farmer' : isProvider ? '🚜 Provider' : '🛡️ Admin'}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>

                      <Link
                        to={getDashboardLink()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                        Dashboard
                      </Link>

                      {isFarmer && (
                        <Link
                          to="/farmer/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          My Farm Profile
                        </Link>
                      )}

                      {isProvider && (
                        <Link
                          to="/provider/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          Provider Settings
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-farm-600 hover:bg-farm-700 text-white shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
