import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  Receipt,
  Loader2
} from 'lucide-react';

export const PaymentModal = ({ request, isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState('UPI_QR');
  const [amount, setAmount] = useState(request?.finalCost || request?.estimatedCost || 0);
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !request) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        requestId: request.id,
        amount: Number(amount),
        paymentMethod: method,
        paymentStatus: 'COMPLETED',
        transactionRef: transactionRef || (method === 'UPI_QR' ? 'UPI' + Date.now().toString().slice(-8) : 'CASH-' + Date.now().toString().slice(-6)),
        notes: notes || `Settled for ${request.trackingNumber}`
      };

      const res = await apiClient.post('/payments/process', payload);
      if (res.data.success) {
        setSuccessData(res.data.data);
        if (onSuccess) onSuccess(res.data.data);
      } else {
        setError(res.data.message || 'Payment processing failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-farm-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-base font-bold text-white">Payment & Billing</h3>
              <p className="text-[11px] text-emerald-200">Request #{request.trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-700 space-y-5">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Payment Successfully Recorded!</h4>
              <p className="text-slate-500">
                Amount ₹{successData.amount} paid via {successData.paymentMethod}.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 font-mono text-[11px] space-y-1">
                <div><span className="text-slate-400">Invoice:</span> {successData.invoiceNumber}</div>
                <div><span className="text-slate-400">Ref ID:</span> {successData.transactionRef}</div>
                <div><span className="text-slate-400">Date:</span> {new Date().toLocaleString()}</div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold transition shadow"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              
              {/* Cost Summary */}
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-emerald-800 font-bold block">{request.serviceItemName}</span>
                  <span className="text-[11px] text-emerald-700">
                    {request.landAreaOrQuantity} {request.unitLabel || 'Units'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 uppercase font-bold block">Payable Total</span>
                  <span className="text-lg font-extrabold text-emerald-900">₹{amount}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Choose Payment Option</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI_QR')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold text-left transition ${
                      method === 'UPI_QR'
                        ? 'border-farm-600 bg-farm-50 text-farm-900 ring-1 ring-farm-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-farm-600" />
                    <span>UPI / QR Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('CASH_ON_DELIVERY')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold text-left transition ${
                      method === 'CASH_ON_DELIVERY'
                        ? 'border-farm-600 bg-farm-50 text-farm-900 ring-1 ring-farm-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('BANK_TRANSFER')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold text-left transition ${
                      method === 'BANK_TRANSFER'
                        ? 'border-farm-600 bg-farm-50 text-farm-900 ring-1 ring-farm-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('ONLINE_CARD')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold text-left transition ${
                      method === 'ONLINE_CARD'
                        ? 'border-farm-600 bg-farm-50 text-farm-900 ring-1 ring-farm-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>Debit / Card</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Sub-view per payment method */}
              {method === 'UPI_QR' && (
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-32 h-32 bg-white p-2 border border-slate-300 rounded-lg mx-auto flex items-center justify-center shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=farmassist.agri@upi&pn=FarmAssist&am=${amount}&cu=INR`} 
                      alt="UPI QR Code" 
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scan using Google Pay, PhonePe, Paytm or BHIM UPI
                  </p>
                  <p className="font-mono text-slate-700 text-[11px] font-bold">UPI ID: farmassist.agri@upi</p>
                </div>
              )}

              {/* Transaction Ref */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  UTR / Reference Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 42918821901"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Notes</label>
                <input
                  type="text"
                  placeholder="Add any remarks..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                  {error}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
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
                  className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold shadow-md shadow-farm-600/20 transition flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Payment (₹{amount})
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
