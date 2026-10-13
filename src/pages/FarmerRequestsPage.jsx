import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { TrackingModal } from '../components/common/TrackingModal';
import { PaymentModal } from '../components/common/PaymentModal';
import { ReviewModal } from '../components/common/ReviewModal';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  CreditCard, 
  Star, 
  XCircle, 
  Calendar, 
  MapPin, 
  Loader2,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackReq, setSelectedTrackReq] = useState(null);
  const [selectedPayReq, setSelectedPayReq] = useState(null);
  const [selectedReviewReq, setSelectedReviewReq] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/requests/my');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (id) => {
    const reason = prompt('Please enter cancellation reason:');
    if (reason === null) return;

    try {
      const res = await apiClient.post(`/requests/${id}/cancel`, { reason });
      if (res.data.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel request');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'ACTIVE'
        ? ['PENDING', 'ACCEPTED', 'ASSIGNED', 'IN_PROGRESS'].includes(r.status)
        : activeTab === 'COMPLETED'
        ? r.status === 'COMPLETED'
        : ['CANCELLED', 'REJECTED'].includes(r.status);

    const matchesSearch =
      searchQuery.trim() === '' ||
      r.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceItemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.providerName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Agricultural Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time progress, invoice payments, and service reviews
          </p>
        </div>

        <Link
          to="/farmer/book"
          className="px-5 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-center shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" /> Book New Service
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'ACTIVE', label: 'Active & In-Progress' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled / Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-farm-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-farm-500 outline-none"
          />
        </div>
      </div>

      {/* Requests Table / List */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-farm-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading requests...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold text-sm">No service requests found</p>
          <p className="text-slate-400 text-xs mt-1">Try switching tabs or book a new service.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-slate-50/80 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-farm-900 bg-farm-100/70 px-2.5 py-0.5 rounded">
                      {req.trackingNumber}
                    </span>
                    <StatusBadge status={req.status} />
                    <UrgencyBadge level={req.urgencyLevel} />
                    <span className="text-xs font-bold text-slate-400">
                      • {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{req.serviceItemName}</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Scheduled</span>
                      <span className="font-semibold text-slate-800">{req.requestedDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Land / Qty</span>
                      <span className="font-semibold text-slate-800">{req.landAreaOrQuantity} {req.unitLabel || 'Units'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Provider</span>
                      <span className="font-semibold text-slate-800">{req.providerName || 'Pending Assignment'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Bill</span>
                      <span className="font-black text-farm-800">₹{req.finalCost || req.estimatedCost}</span>
                    </div>
                  </div>

                  {req.executionNotes && (
                    <div className="text-[11px] bg-emerald-50 text-emerald-900 p-2 rounded-lg border border-emerald-100">
                      <strong>Provider Execution Update:</strong> {req.executionNotes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => setSelectedTrackReq(req)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-farm-600" />
                    Track
                  </button>

                  {/* Payment Button */}
                  {req.paymentStatus !== 'COMPLETED' && req.status !== 'CANCELLED' && req.status !== 'REJECTED' && (
                    <button
                      onClick={() => setSelectedPayReq(req)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay Bill
                    </button>
                  )}

                  {/* Rating / Review Button for Completed */}
                  {req.status === 'COMPLETED' && !req.review && (
                    <button
                      onClick={() => setSelectedReviewReq(req)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Rate Service
                    </button>
                  )}

                  {/* Cancel for Pending */}
                  {['PENDING', 'UNDER_REVIEW'].includes(req.status) && (
                    <button
                      onClick={() => handleCancel(req.id)}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <TrackingModal
        isOpen={!!selectedTrackReq}
        request={selectedTrackReq}
        onClose={() => setSelectedTrackReq(null)}
      />

      <PaymentModal
        isOpen={!!selectedPayReq}
        request={selectedPayReq}
        onClose={() => setSelectedPayReq(null)}
        onSuccess={() => {
          setSelectedPayReq(null);
          fetchRequests();
        }}
      />

      <ReviewModal
        isOpen={!!selectedReviewReq}
        request={selectedReviewReq}
        onClose={() => setSelectedReviewReq(null)}
        onSuccess={() => {
          setSelectedReviewReq(null);
          fetchRequests();
        }}
      />
    </div>
  );
};
