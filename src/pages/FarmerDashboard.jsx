import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { TrackingModal } from '../components/common/TrackingModal';
import { PaymentModal } from '../components/common/PaymentModal';
import { ReviewModal } from '../components/common/ReviewModal';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Eye, 
  CreditCard, 
  Star,
  Sprout,
  Compass,
  Loader2,
  AlertTriangle
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrackReq, setSelectedTrackReq] = useState(null);
  const [selectedPayReq, setSelectedPayReq] = useState(null);
  const [selectedReviewReq, setSelectedReviewReq] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [statsRes, reqsRes] = await Promise.all([
        apiClient.get('/dashboard/stats'),
        apiClient.get('/requests/my'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (reqsRes.data.success) setRequests(reqsRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeRequests = requests.filter(
    (r) => r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS'
  );

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-farm-800 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-2">
            <Sprout className="w-3.5 h-3.5" />
            Farmer Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your machinery requests, soil test bookings, irrigation scheduling, and transport dispatches in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/farmer/book"
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Book New Agri Service
          </Link>
          <Link
            to="/catalog"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 flex items-center gap-2 backdrop-blur-sm"
          >
            <Compass className="w-4 h-4" />
            Browse Catalog
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-farm-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading farmer dashboard...</span>
        </div>
      ) : (
        <>
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Active Requests</span>
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
                <span className="text-xs font-semibold text-slate-500 block">Completed Jobs</span>
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
                <span className="text-xs font-semibold text-slate-500 block">Total Requests</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                  {stats?.totalRequests || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Total Spent</span>
                <span className="text-2xl font-extrabold text-farm-700 mt-1 block">
                  ₹{stats?.totalExpenses || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-farm-100 text-farm-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Active Live Requests Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Live & Ongoing Service Requests ({activeRequests.length})
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Real-time status updates of your scheduled and active bookings</p>
              </div>

              <Link
                to="/farmer/requests"
                className="text-xs font-bold text-farm-600 hover:text-farm-700 flex items-center gap-1"
              >
                View Full History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <p>No active service requests right now.</p>
                <Link
                  to="/farmer/book"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-farm-600 text-white font-bold text-xs hover:bg-farm-700 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" /> Book a Service
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeRequests.map((req) => (
                  <div key={req.id} className="p-5 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {req.trackingNumber}
                        </span>
                        <StatusBadge status={req.status} />
                        <UrgencyBadge level={req.urgencyLevel} />
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{req.serviceItemName}</h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-farm-600" />
                          {req.requestedDate} ({req.preferredTimeSlot})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-farm-600" />
                          {req.farmLocation}, {req.villageDistrict}
                        </span>
                        <span className="font-semibold text-slate-800">
                          Qty: {req.landAreaOrQuantity} {req.unitLabel || 'Units'}
                        </span>
                      </div>

                      {req.providerName && (
                        <div className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-100">
                          Assigned Provider: <span className="font-bold">{req.providerName}</span> ({req.providerPhone})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => setSelectedTrackReq(req)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Track Timeline
                      </button>

                      {req.paymentStatus !== 'COMPLETED' && (
                        <button
                          onClick={() => setSelectedPayReq(req)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay ₹{req.finalCost || req.estimatedCost}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Categories Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Quick Agricultural Services Booking</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/farmer/book?category=MACHINERY"
                className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-farm-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
                  🚜
                </div>
                <h4 className="font-bold text-xs text-slate-900">Tractor & Heavy Machinery</h4>
                <p className="text-[11px] text-slate-500 mt-1">Ploughing, rotavators, leveler</p>
              </Link>

              <Link
                to="/farmer/book?category=DRONE_SPRAY"
                className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
                  ✈️
                </div>
                <h4 className="font-bold text-xs text-slate-900">Drone Urea / Spray</h4>
                <p className="text-[11px] text-slate-500 mt-1">Fast 8-minute aerial foliar mist</p>
              </Link>

              <Link
                to="/farmer/book?category=TRANSPORT"
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
                  🚚
                </div>
                <h4 className="font-bold text-xs text-slate-900">Farm-to-Mandi Transport</h4>
                <p className="text-[11px] text-slate-500 mt-1">5-Ton / 10-Ton grain trucks</p>
              </Link>

              <Link
                to="/farmer/book?category=SOIL_TESTING"
                className="p-4 rounded-2xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
                  🧪
                </div>
                <h4 className="font-bold text-xs text-slate-900">Soil Health Test Card</h4>
                <p className="text-[11px] text-slate-500 mt-1">14-parameter NPK & pH analysis</p>
              </Link>
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={!!selectedPayReq}
        request={selectedPayReq}
        onClose={() => setSelectedPayReq(null)}
        onSuccess={() => {
          setSelectedPayReq(null);
          loadData();
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!selectedReviewReq}
        request={selectedReviewReq}
        onClose={() => setSelectedReviewReq(null)}
        onSuccess={() => {
          setSelectedReviewReq(null);
          loadData();
        }}
      />
    </div>
  );
};
