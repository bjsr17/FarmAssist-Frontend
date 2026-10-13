import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { TrackingModal } from '../components/common/TrackingModal';
import { 
  CheckSquare, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  MapPin, 
  Calendar, 
  Phone, 
  Loader2,
  Send,
  User,
  Star,
  DollarSign
} from 'lucide-react';

export const ProviderQueuePage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [myJobs, setMyJobs] = useState([]);
  const [availablePool, setAvailablePool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrackReq, setSelectedTrackReq] = useState(null);

  // Status update modal / form state
  const [updatingReq, setUpdatingReq] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [finalCost, setFinalCost] = useState('');
  const [executionNotes, setExecutionNotes] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const loadData = async () => {
    try {
      const [jobsRes, poolRes] = await Promise.all([
        apiClient.get('/requests/my'),
        apiClient.get('/requests/available-pool'),
      ]);

      if (jobsRes.data.success) setMyJobs(jobsRes.data.data);
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

  const handleClaim = async (id) => {
    try {
      const res = await apiClient.post(`/requests/${id}/claim`);
      if (res.data.success) {
        alert('Job claimed successfully!');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not claim job');
    }
  };

  const openStatusUpdater = (job) => {
    setUpdatingReq(job);
    setNewStatus(job.status === 'ACCEPTED' || job.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'COMPLETED');
    setFinalCost(job.finalCost || job.estimatedCost || '');
    setExecutionNotes(job.executionNotes || '');
    setStatusComment(
      job.status === 'IN_PROGRESS'
        ? 'Field operations successfully completed and verified.'
        : 'Machinery dispatched to farm gate. Operator on site.'
    );
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    setSavingStatus(true);

    try {
      const payload = {
        status: newStatus,
        comment: statusComment,
        finalCost: finalCost ? Number(finalCost) : null,
        executionNotes: executionNotes.trim()
      };

      const res = await apiClient.patch(`/requests/${updatingReq.id}/status`, payload);
      if (res.data.success) {
        setUpdatingReq(null);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const activeJobsList = myJobs.filter(j => ['ACCEPTED', 'ASSIGNED', 'IN_PROGRESS'].includes(j.status));
  const completedJobsList = myJobs.filter(j => j.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Service Operations & Dispatch Board</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage assigned agricultural tasks, claim new pool jobs, and log field machine operations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 max-w-xl">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'ACTIVE'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>My Active Jobs ({activeJobsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('POOL')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'POOL'
              ? 'bg-farm-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Available Pool ({availablePool.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'COMPLETED'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>History ({completedJobsList.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading operations board...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: My Active Jobs */}
          {activeTab === 'ACTIVE' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {activeJobsList.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <p>You have no active jobs in progress.</p>
                  <button
                    onClick={() => setActiveTab('POOL')}
                    className="mt-3 px-4 py-2 rounded-xl bg-farm-600 text-white font-bold text-xs hover:bg-farm-700 transition"
                  >
                    Browse Available Request Pool
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeJobsList.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-slate-50 transition space-y-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {job.trackingNumber}
                            </span>
                            <StatusBadge status={job.status} />
                            <UrgencyBadge level={job.urgencyLevel} />
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{job.serviceItemName}</h3>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={() => setSelectedTrackReq(job)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition"
                          >
                            <Eye className="w-3.5 h-3.5 inline mr-1" /> View Timeline
                          </button>
                          <button
                            onClick={() => openStatusUpdater(job)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-1.5"
                          >
                            Update Field Status / Complete
                          </button>
                        </div>
                      </div>

                      {/* Job Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Farmer Contact</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-farm-600" />
                            {job.farmerName} ({job.farmerPhone})
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Plot Location</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-farm-600 shrink-0" />
                            {job.farmLocation}, {job.villageDistrict}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Area / Qty</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            {job.landAreaOrQuantity} {job.unitLabel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payout</span>
                          <span className="font-black text-emerald-800 text-sm mt-0.5 block">
                            ₹{job.finalCost || job.estimatedCost}
                          </span>
                        </div>
                      </div>

                      {job.notes && (
                        <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                          <span className="font-bold text-amber-900 block mb-0.5">Farmer's Note:</span>
                          <p className="italic">"{job.notes}"</p>
                        </div>
                      )}

                      {job.executionNotes && (
                        <div className="text-xs text-slate-700 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                          <span className="font-bold text-emerald-900 block mb-0.5">Current Field Progress Log:</span>
                          <p>{job.executionNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Available Pool */}
          {activeTab === 'POOL' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {availablePool.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No unassigned service requests available in the pool right now.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {availablePool.map((req) => (
                    <div key={req.id} className="p-6 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {req.trackingNumber}
                          </span>
                          <UrgencyBadge level={req.urgencyLevel} />
                          <span className="text-xs text-slate-400">• Scheduled for {req.requestedDate} ({req.preferredTimeSlot})</span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base">{req.serviceItemName}</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 mt-2">
                          <div><span className="text-slate-400">Farmer:</span> {req.farmerName}</div>
                          <div><span className="text-slate-400">Location:</span> {req.farmLocation}, {req.villageDistrict}</div>
                          <div><span className="text-slate-400">Area/Qty:</span> {req.landAreaOrQuantity} {req.unitLabel}</div>
                        </div>

                        {req.notes && (
                          <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg">
                            "{req.notes}"
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0 self-end md:self-center">
                        <span className="text-sm font-black text-emerald-800 block mb-2">₹{req.estimatedCost}</span>
                        <button
                          onClick={() => handleClaim(req.id)}
                          className="px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold text-xs shadow-md shadow-farm-600/20 transition"
                        >
                          Claim & Accept Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Completed History */}
          {activeTab === 'COMPLETED' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {completedJobsList.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No completed jobs recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {completedJobsList.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-slate-50 transition space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {job.trackingNumber}
                          </span>
                          <StatusBadge status="COMPLETED" />
                          <span className="text-xs text-slate-400">
                            Completed on {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <span className="text-sm font-black text-emerald-800">
                          ₹{job.finalCost || job.estimatedCost}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{job.serviceItemName}</h4>
                      <p className="text-xs text-slate-600">Farmer: {job.farmerName} • Location: {job.farmLocation}, {job.villageDistrict}</p>

                      {job.review && (
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                          <div className="font-bold text-amber-900 mb-0.5">
                            Farmer Rating: {'★'.repeat(job.review.rating)}{'☆'.repeat(5 - job.review.rating)}
                          </div>
                          <p className="text-slate-700 italic">"{job.review.comments}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Status Update Modal */}
      {updatingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Update Job Status #{updatingReq.trackingNumber}</h3>
              <button onClick={() => setUpdatingReq(null)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="p-6 text-xs text-slate-700 space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Set New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ACCEPTED">ACCEPTED (Order Confirmed)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Dispatched / On Field)</option>
                  <option value="COMPLETED">COMPLETED (Work Done & Verified)</option>
                  <option value="CANCELLED">CANCELLED (Unable to service)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Final Total Bill Amount (₹)</label>
                <input
                  type="number"
                  step="10"
                  value={finalCost}
                  onChange={(e) => setFinalCost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">On-Site Execution Notes (visible to farmer)</label>
                <textarea
                  rows={2}
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  placeholder="e.g. 55HP Tractor operator Baljit on site. 10 acres tillage completed."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Audit Timeline Comment</label>
                <input
                  type="text"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="e.g. Dispatched machinery to farmer plot"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUpdatingReq(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStatus}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow"
                >
                  {savingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Status Update
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
