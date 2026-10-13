import React from 'react';
import { 
  X, 
  Clock, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { UrgencyBadge } from './UrgencyBadge';

export const TrackingModal = ({ request, isOpen, onClose }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-farm-800 to-emerald-700 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs tracking-wider">
                {request.trackingNumber}
              </span>
              <UrgencyBadge level={request.urgencyLevel} />
            </div>
            <h3 className="text-lg font-bold mt-1 text-white">
              {request.serviceItemName || 'Agricultural Service Request'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Status and Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
              <div className="mt-1">
                <StatusBadge status={request.status} />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Schedule Date</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5 text-farm-600" />
                {request.requestedDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Land / Quantity</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {request.landAreaOrQuantity} {request.unitLabel || 'Units'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
              <span className="font-bold text-farm-700 text-sm mt-0.5 block">
                ₹{request.finalCost || request.estimatedCost || 0}
              </span>
            </div>
          </div>

          {/* Farmer & Provider Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Farmer & Location
              </span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-farm-600" />
                {request.farmerName}
              </div>
              <div className="text-slate-500 mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {request.farmerPhone || 'N/A'}
              </div>
              <div className="text-slate-600 mt-1.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-farm-600 shrink-0 mt-0.5" />
                <span>{request.farmLocation}, {request.villageDistrict}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Assigned Service Provider
              </span>
              {request.providerName ? (
                <>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {request.providerName}
                  </div>
                  <div className="text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {request.providerPhone || 'N/A'}
                  </div>
                  {request.executionNotes && (
                    <div className="mt-2 text-[11px] bg-emerald-50 p-2 rounded text-emerald-900 border border-emerald-100">
                      <strong>On-Site Notes:</strong> {request.executionNotes}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                  Awaiting provider assignment or claim from the regional pool.
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Farmer Instructions:</span>
              <p className="text-slate-600 italic">"{request.notes}"</p>
            </div>
          )}

          {/* Progress Timeline */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-farm-600" />
              Service Audit Timeline & Lifecycle History
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {request.timeline && request.timeline.length > 0 ? (
                request.timeline.map((item, idx) => (
                  <div key={item.id || idx} className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-farm-600 ring-4 ring-farm-100 flex items-center justify-center"></div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <StatusBadge status={item.status} />
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium text-xs mt-1">{item.comment}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Updated by: {item.updatedByName}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs italic">No timeline entries recorded yet.</div>
              )}
            </div>
          </div>

          {/* Review Details if any */}
          {request.review && (
            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-900 text-xs">Farmer Feedback:</span>
                <span className="text-amber-600 font-bold">
                  {'★'.repeat(request.review.rating)}{'☆'.repeat(5 - request.review.rating)} ({request.review.rating}/5)
                </span>
              </div>
              <p className="text-slate-700 text-xs italic">"{request.review.comments}"</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
