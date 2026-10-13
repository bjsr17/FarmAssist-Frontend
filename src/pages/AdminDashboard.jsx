import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { TrackingModal } from '../components/common/TrackingModal';
import { 
  Users, 
  Wrench, 
  ClipboardList, 
  DollarSign, 
  Grid, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#2d874b', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308', '#64748b'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrackReq, setSelectedTrackReq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reqsRes] = await Promise.all([
          apiClient.get('/dashboard/admin-summary'),
          apiClient.get('/requests/all')
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (reqsRes.data.success) setRecentRequests(reqsRes.data.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format data for charts
  const categoryChartData = stats?.requestsByCategory
    ? Object.entries(stats.requestsByCategory).map(([name, value]) => ({ name, value }))
    : [];

  const statusChartData = stats?.requestsByStatus
    ? Object.entries(stats.requestsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const trendData = stats?.monthlyTrends || [];

  return (
    <div className="space-y-6">
      
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Central Agricultural Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            System Administration & Analytics
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Monitor state-wide agricultural requests, provider dispatches, catalog pricing, and financial settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/requests"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            Dispatch Console
          </Link>
          <Link
            to="/admin/catalog"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
          >
            Manage Catalog Rates
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading administrative analytics...</span>
        </div>
      ) : (
        <>
          {/* KPI Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Total Requests</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                  {stats?.totalRequests || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Registered Farmers</span>
                <span className="text-2xl font-extrabold text-farm-700 mt-1 block">
                  {stats?.totalFarmers || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-farm-100 text-farm-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Active Providers</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                  {stats?.totalProviders || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">System Volume</span>
                <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">
                  ₹{stats?.totalRevenue || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Interactive Recharts Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Monthly Requests Trend */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Monthly Request Volume</h3>
                  <p className="text-slate-500 text-[11px]">Agricultural demand trend over past months</p>
                </div>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val, name) => [name === 'revenue' ? `₹${val}` : val, name === 'revenue' ? 'Revenue' : 'Requests']}
                      contentStyle={{ borderRadius: 12, fontSize: 11 }}
                    />
                    <Bar dataKey="requestCount" fill="#2d874b" radius={[6, 6, 0, 0]} name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Category Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Requests by Service Category</h3>
                  <p className="text-slate-500 text-[11px]">Distribution across machinery, irrigation, drones & transport</p>
                </div>
                <Grid className="w-4 h-4 text-farm-600" />
              </div>

              <div className="h-64 flex items-center justify-center">
                {categoryChartData.length === 0 ? (
                  <div className="text-xs text-slate-400">No category data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>

          {/* Recent Dispatches & Requests Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Agricultural Requests</h3>
                <p className="text-slate-500 text-xs mt-0.5">Real-time incoming farmer bookings across districts</p>
              </div>

              <Link to="/admin/requests" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Open Full Dispatch Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-5">Tracking ID</th>
                    <th className="py-3.5 px-5">Farmer & District</th>
                    <th className="py-3.5 px-5">Service Category</th>
                    <th className="py-3.5 px-5">Assigned Provider</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Amount</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-5 font-mono font-bold text-slate-900">
                        {req.trackingNumber}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">{req.farmerName}</div>
                        <div className="text-[11px] text-slate-400">{req.villageDistrict}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800">{req.serviceItemName}</div>
                        <div className="text-[10px] text-farm-600 uppercase font-bold">{req.serviceCategoryName}</div>
                      </td>
                      <td className="py-4 px-5">
                        {req.providerName ? (
                          <span className="font-bold text-slate-800">{req.providerName}</span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                            Unassigned Pool
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900">
                        ₹{req.finalCost || req.estimatedCost}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedTrackReq(req)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={!!selectedTrackReq}
        request={selectedTrackReq}
        onClose={() => setSelectedTrackReq(null)}
      />
    </div>
  );
};
