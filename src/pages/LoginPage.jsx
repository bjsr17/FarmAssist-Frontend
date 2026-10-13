import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, Loader2, User, Wrench, ShieldCheck, Check } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      if (redirect) {
        navigate(redirect);
      } else if (res.data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.data.role === 'ROLE_PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleDemoFill = (roleType) => {
    if (roleType === 'FARMER') {
      setEmail('ramesh.patel@kisan.in');
      setPassword('farmer123');
    } else if (roleType === 'PROVIDER') {
      setEmail('kisan.agro@services.in');
      setPassword('provider123');
    } else if (roleType === 'ADMIN') {
      setEmail('admin@farmassist.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Branding */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-farm-600 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 mx-auto mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign in to FarmAssist</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your farmer requests, provider service queue, or admin dashboard
          </p>
        </div>

        {/* Demo Fast Account Selector */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs">
          <span className="font-bold text-emerald-900 block mb-2">⚡ Quick Fill Demo Credentials:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('FARMER')}
              className="p-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-900 font-semibold text-[11px] flex flex-col items-center gap-1 transition shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('PROVIDER')}
              className="p-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 font-semibold text-[11px] flex flex-col items-center gap-1 transition shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              Provider
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('ADMIN')}
              className="p-2 rounded-xl bg-white border border-indigo-300 hover:bg-indigo-100/50 text-indigo-900 font-semibold text-[11px] flex flex-col items-center gap-1 transition shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh.patel@kisan.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-500 font-medium text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-500 font-medium text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold shadow-md shadow-farm-600/20 transition flex items-center justify-center gap-2 text-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-farm-600 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
