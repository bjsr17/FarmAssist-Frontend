import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { 
  Search, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  Sprout
} from 'lucide-react';

export const TrackPublicPage = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [trackingNumber, setTrackingNumber] = useState(initialId);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await apiClient.get(`/requests/track/${trackingNumber.trim().toUpperCase()}`);
      if (res.data.success && res.data.data) {
        setRequest(res.data.data);
      } else {
        setRequest(null);
        setError('No service request found with tracking number: ' + trackingNumber);
      }
    } catch (err) {
      setRequest(null);
      setError('Could not find request. Please check tracking ID format (e.g. FA-2026-1042).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch();
    }
  }, [initialId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-farm-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Track Agricultural Service Request</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Enter your unique Request Tracking Number to view real-time machinery dispatch, on-site execution, and audit timeline
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2">
        <input
          type="text"
          required
          placeholder="Enter Tracking ID (e.g. FA-2026-1042 or FA-2026-0984)..."
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-mono font-bold bg-transparent outline-none uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Track Status
        </button>
      </form>

      {/* Suggested Quick Tracking IDs */}
      <div className="text-center text-xs text-slate-500">
        Try sample IDs:{' '}
        {['FA-2026-1042', 'FA-2026-0984', 'FA-2026-1158'].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTrackingNumber(id);
              handleSearch();
            }}
            className="font-mono text-farm-700 underline font-semibold mx-1.5 hover:text-farm-900"
          >
            {id}
          </button>
        ))}
      </div>

      {/* Results View */}
      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-200 text-center text-xs font-semibold">
          {error}
        </div>
      )}

      {request && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in space-y-6">
          
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-farm-800 to-emerald-700 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs tracking-wider">
                  {request.trackingNumber}
                </span>
                <UrgencyBadge level={request.urgencyLevel} />
              </div>
              <h2 className="text-xl font-black text-white mt-1">{request.serviceItemName}</h2>
              <p className="text-emerald-100 text-xs mt-0.5">{request.serviceCategoryName}</p>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl text-right shrink-0 border border-white/20">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">Current State</span>
              <div className="mt-1"><StatusBadge status={request.status} /></div>
            </div>
          </div>

          <div className="p-6 space-y-6 text-xs text-slate-700">
            
            {/* Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Scheduled Date</span>
                <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-farm-600" />
                  {request.requestedDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Quantity / Land</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {request.landAreaOrQuantity} {request.unitLabel || 'Units'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Bill Total</span>
                <span className="font-black text-farm-800 text-sm mt-0.5 block">
                  ₹{request.finalCost || request.estimatedCost}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Payment Status</span>
                <span className={`font-bold mt-0.5 block ${request.paymentStatus === 'COMPLETED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {request.paymentStatus}
                </span>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Farmer & Location</span>
                <div className="font-bold text-slate-900">{request.farmerName}</div>
                <div className="text-slate-500 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-farm-600 shrink-0 mt-0.5" />
                  <span>{request.farmLocation}, {request.villageDistrict}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Assigned Provider</span>
                {request.providerName ? (
                  <>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {request.providerName}
                    </div>
                    {request.executionNotes && (
                      <p className="text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-100">
                        {request.executionNotes}
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-amber-700 italic">Awaiting provider claim</span>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-farm-600" />
                Live Service Timeline History
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {request.timeline && request.timeline.length > 0 ? (
                  request.timeline.map((item, idx) => (
                    <div key={item.id || idx} className="relative">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-farm-600 ring-4 ring-farm-100"></div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <StatusBadge status={item.status} />
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium mt-1">{item.comment}</p>
                        <div className="text-[10px] text-slate-400 mt-1">Logged by: {item.updatedByName}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-xs">No timeline records logged yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
