import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { TrackingModal } from '../components/common/TrackingModal';
import { 
  Wrench, 
  CheckSquare, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle2, 
  Eye, 
  ArrowRight,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [availablePool, setAvailablePool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrackReq, setSelectedTrackReq] = useState(null);

  const loadData = async () => {
    try {
      const [statsRes, jobsRes, poolRes] = await Promise.all([
        apiClient.get('/dashboard/stats'),
        apiClient.get('/requests/my'),
        apiClient.get('/requests/available-pool')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (jobsRes.data.success) {
        setActiveJobs(jobsRes.data.data.filter(r => ['ACCEPTED', 'ASSIGNED', 'IN_PROGRESS'].includes(r.status)));
      }
      if (poolRes.data.success) setAvailablePool(poolRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimJob = async (id) => {
    try {
      const res = await apiClient.post(`/requests/${id}/claim`);
      if (res.data.success) {
        alert('Service request claimed successfully! Added to your active jobs queue.');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not claim request');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5" />
            Service Provider Operations Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {user?.name || 'Provider Hub'}
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
            Accept agricultural work orders, deploy machinery and field crews, and track earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/provider/queue"
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-lg flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            View Available Pool ({availablePool.length})
          </Link>
          <Link
            to="/provider/profile"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
          >
            Manage Equipment & Rates
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading operations dashboard...</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Active Jobs</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                  {stats?.inProgressRequests + stats?.pendingRequests || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Completed Work</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                  {stats?.completedRequests || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Total Revenue</span>
                <span className="text-2xl font-extrabold text-farm-700 mt-1 block">
                  ₹{stats?.totalRevenue || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-farm-100 text-farm-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Customer Rating</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-1">
                  ⭐ {stats?.providerRating || 4.8}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Active Jobs Queue */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  My Active Service Assignments ({activeJobs.length})
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Jobs currently accepted, scheduled, or in execution on field</p>
              </div>

              <Link to="/provider/queue" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                Open Full Operations Board <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <p>No active assignments in progress right now.</p>
                <Link to="/provider/queue" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-sm transition">
                  Claim from Available Pool
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-5 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {job.trackingNumber}
                        </span>
                        <StatusBadge status={job.status} />
                        <UrgencyBadge level={job.urgencyLevel} />
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{job.serviceItemName}</h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Farmer: <strong>{job.farmerName}</strong> ({job.farmerPhone})</span>
                        <span>Location: {job.farmLocation}, {job.villageDistrict}</span>
                        <span>Area: {job.landAreaOrQuantity} {job.unitLabel}</span>
                        <span className="font-bold text-farm-800">Bill: ₹{job.finalCost || job.estimatedCost}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => setSelectedTrackReq(job)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Track Audit
                      </button>
                      <Link
                        to="/provider/queue"
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
                      >
                        Update Progress
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Jobs in Regional Pool */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  Unassigned Requests in Regional Pool ({availablePool.length})
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Farmers waiting for certified service provider claiming</p>
              </div>
            </div>

            {availablePool.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                All incoming farmer requests have been claimed! Check back soon.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {availablePool.slice(0, 5).map((req) => (
                  <div key={req.id} className="p-5 hover:bg-amber-50/30 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {req.trackingNumber}
                        </span>
                        <UrgencyBadge level={req.urgencyLevel} />
                        <span className="text-xs text-slate-400">• Scheduled for {req.requestedDate}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{req.serviceItemName}</h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span>Farmer: {req.farmerName}</span>
                        <span>Location: {req.farmLocation}, {req.villageDistrict}</span>
                        <span className="font-semibold text-emerald-800">Est. Payout: ₹{req.estimatedCost}</span>
                      </div>

                      {req.notes && (
                        <p className="text-[11px] text-slate-500 italic">"{req.notes}"</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleClaimJob(req.id)}
                      className="px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold text-xs shadow-md shadow-farm-600/20 transition self-end md:self-center shrink-0"
                    >
                      Accept & Claim Job (₹{req.estimatedCost})
                    </button>
                  </div>
                ))}
              </div>
            )}
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
