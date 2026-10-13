import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { X, Star, Loader2, Award } from 'lucide-react';

export const ReviewModal = ({ request, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/reviews', {
        requestId: request.id,
        rating: Number(rating),
        comments: comments.trim() || 'Service was completed satisfactorily.'
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      } else {
        setError(res.data.message || 'Could not submit review');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Review submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-200" />
            <h3 className="text-base font-bold text-white">Rate Completed Service</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 text-xs text-slate-700 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Item</span>
            <div className="font-bold text-slate-800 text-sm">{request.serviceItemName}</div>
            <div className="text-slate-500 mt-0.5">Provider: {request.providerName}</div>
          </div>

          {/* Star Selector */}
          <div className="text-center py-2">
            <label className="block font-bold text-slate-700 mb-2">How satisfied are you with this service?</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-100 text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 mt-1 block">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5/5)' :
               rating === 4 ? '⭐⭐⭐⭐ Good (4/5)' :
               rating === 3 ? '⭐⭐⭐ Average (3/5)' :
               rating === 2 ? '⭐⭐ Poor (2/5)' : '⭐ Very Unsatisfactory (1/5)'}
            </span>
          </div>

          {/* Comments */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Feedback & Recommendations</label>
            <textarea
              rows={3}
              placeholder="Describe machine performance, punctuality, operator behavior..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs">
              {error}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-600/20 transition flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
