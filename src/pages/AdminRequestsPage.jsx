import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { TrackingModal } from '../components/common/TrackingModal';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  Settings, 
  Loader2,
  Calendar,
  MapPin,
  XCircle,
  CheckCircle2
} from 'lucide-react';

export const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedTrackReq, setSelectedTrackReq] = useState(null);
  const [assigningReq, setAssigningReq] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assigningLoading, setAssigningLoading] = useState(false);

  const loadData = async () => {
    try {
      const [reqsRes, provsRes, catsRes] = await Promise.all([
        apiClient.get('/requests/all'),
        apiClient.get('/admin/providers'),
        apiClient.get('/catalog/categories/all')
      ]);

      if (reqsRes.data.success) setRequests(reqsRes.data.data);
      if (provsRes.data.success) setProviders(provsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProviderId) return;
    setAssigningLoading(true);

    try {
      const res = await apiClient.post(`/requests/${assigningReq.id}/assign`, {
        providerId: Number(selectedProviderId),
        assignmentNotes: assignmentNotes || 'Assigned by Administrator'
      });
      if (res.data.success) {
        setAssigningReq(null);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    } finally {
      setAssigningLoading(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = !selectedStatus || r.status === selectedStatus;
    const matchesCat = !selectedCategory || String(r.serviceCategoryId) === String(selectedCategory);
    const matchesSearch =
      !searchQuery ||
      r.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceItemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.providerName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Service Request Master Dispatcher</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Central management for assigning providers, overriding status, and reviewing farmer service records
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Pool</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracking ID, farmer, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          />
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading master dispatch records...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 text-xs">
          No agricultural requests found matching your filter.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Tracking ID</th>
                  <th className="py-3.5 px-4">Farmer Details</th>
                  <th className="py-3.5 px-4">Requested Service</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Assigned Provider</th>
                  <th className="py-3.5 px-4">Status & Urgency</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {req.trackingNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{req.farmerName}</div>
                      <div className="text-[11px] text-slate-400">{req.villageDistrict}</div>
                      <div className="text-[10px] text-slate-400">{req.farmerPhone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{req.serviceItemName}</div>
                      <div className="text-[11px] text-slate-500">{req.landAreaOrQuantity} {req.unitLabel}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{req.requestedDate}</div>
                      <div className="text-[10px] text-slate-400">{req.preferredTimeSlot}</div>
                    </td>
                    <td className="py-4 px-4">
                      {req.providerName ? (
                        <div>
                          <span className="font-bold text-slate-900 block">{req.providerName}</span>
                          <span className="text-[10px] text-slate-400">{req.providerPhone}</span>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Unassigned Pool
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <div><StatusBadge status={req.status} /></div>
                      <div><UrgencyBadge level={req.urgencyLevel} /></div>
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">
                      ₹{req.finalCost || req.estimatedCost}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedTrackReq(req)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View Timeline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setAssigningReq(req);
                            setSelectedProviderId(req.providerId ? String(req.providerId) : '');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Assign Provider Modal */}
      {assigningReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Assign Service Provider</h3>
              <button onClick={() => setAssigningReq(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 text-xs text-slate-700 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Request Details</span>
                <div className="font-bold text-slate-900 mt-0.5">{assigningReq.trackingNumber} - {assigningReq.serviceItemName}</div>
                <div className="text-slate-500 mt-0.5">Farmer: {assigningReq.farmerName} ({assigningReq.villageDistrict})</div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Service Provider</label>
                <select
                  required
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="">-- Choose Provider --</option>
                  {providers.map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {p.agencyName || p.providerName} (Coverage: {p.coverageDistricts || 'All'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Admin Dispatch Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Priority dispatch allocated by district nodal officer"
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningReq(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigningLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow"
                >
                  {assigningLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
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
