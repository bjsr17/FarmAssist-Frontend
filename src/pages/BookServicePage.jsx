import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Loader2,
  DollarSign,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const BookServicePage = () => {
  const [searchParams] = useSearchParams();
  const preselectedItemId = searchParams.get('itemId');
  const preselectedCatCode = searchParams.get('category');

  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(5.0);
  const [requestedDate, setRequestedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (08:00 - 12:00)');
  const [urgencyLevel, setUrgencyLevel] = useState('NORMAL');
  const [farmLocation, setFarmLocation] = useState(user?.profile?.farmLocation || user?.address || 'Plot 42, North Field');
  const [villageDistrict, setVillageDistrict] = useState(user?.profile?.district || user?.district || 'Ludhiana, Punjab');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submittedReq, setSubmittedReq] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiClient.get('/catalog/categories');
        if (res.data.success) {
          setCategories(res.data.data);

          if (preselectedItemId) {
            for (const cat of res.data.data) {
              const item = cat.items?.find((i) => String(i.id) === String(preselectedItemId));
              if (item) {
                setSelectedCategory(cat);
                setSelectedItem(item);
                break;
              }
            }
          } else if (preselectedCatCode) {
            const cat = res.data.data.find((c) => c.code === preselectedCatCode);
            if (cat) {
              setSelectedCategory(cat);
              if (cat.items?.length > 0) setSelectedItem(cat.items[0]);
            }
          } else if (res.data.data.length > 0) {
            setSelectedCategory(res.data.data[0]);
            if (res.data.data[0].items?.length > 0) setSelectedItem(res.data.data[0].items[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [preselectedItemId, preselectedCatCode]);

  const estimatedCost = selectedItem ? Math.round(selectedItem.basePrice * quantity * 100) / 100 : 0;

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat.items && cat.items.length > 0) {
      setSelectedItem(cat.items[0]);
    } else {
      setSelectedItem(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        serviceItemId: selectedItem.id,
        requestedDate,
        preferredTimeSlot,
        urgencyLevel,
        farmLocation,
        villageDistrict,
        landAreaOrQuantity: Number(quantity),
        notes: notes.trim()
      };

      const res = await apiClient.post('/requests', payload);
      if (res.data.success) {
        setSubmittedReq(res.data.data);
        setStep(4); // Success screen
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit service request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-farm-600 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Preparing booking catalog...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Book Agricultural Service</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit equipment, drone spraying, irrigation, or transport requests with real-time tracking
        </p>
      </div>

      {/* Step Indicator */}
      {step < 4 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 font-bold ${step >= 1 ? 'text-farm-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 1 ? 'bg-farm-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span>Service & Quantity</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block"></div>

          <div className={`flex items-center gap-2 font-bold ${step >= 2 ? 'text-farm-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 2 ? 'bg-farm-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>2</span>
            <span>Schedule & Location</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block"></div>

          <div className={`flex items-center gap-2 font-bold ${step >= 3 ? 'text-farm-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 3 ? 'bg-farm-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>3</span>
            <span>Review & Submit</span>
          </div>
        </div>
      )}

      {/* STEP 1: Service Selection */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <div>
            <label className="block font-bold text-slate-800 text-sm mb-3">1. Select Service Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    selectedCategory?.id === cat.id
                      ? 'border-farm-600 bg-farm-50/80 text-farm-950 ring-2 ring-farm-600/30 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-xs">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{cat.items?.length || 0} services</span>
                </button>
              ))}
            </div>
          </div>

          {/* Specific Service Item */}
          <div>
            <label className="block font-bold text-slate-800 text-sm mb-3">2. Choose Specific Service / Machinery</label>
            <div className="space-y-2">
              {selectedCategory?.items?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                    selectedItem?.id === item.id
                      ? 'border-farm-600 bg-emerald-50/70 ring-1 ring-farm-600'
                      : 'border-slate-200 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-farm-800 block">₹{item.basePrice}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.unitLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity / Land Area & Dynamic Cost Estimator */}
          {selectedItem && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Land Area / Service Quantity ({selectedItem.unitLabel})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-farm-500"
                    />
                    <span className="text-xs font-semibold text-slate-500 shrink-0">
                      {selectedItem.unitLabel}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-100/70 p-4 rounded-xl border border-emerald-200 text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Calculated Estimated Cost
                  </span>
                  <span className="text-2xl font-black text-emerald-950">
                    ₹{estimatedCost}
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    ({quantity} × ₹{selectedItem.basePrice})
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!selectedItem}
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm"
            >
              Continue to Schedule <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Scheduling & Location */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Schedule & Farm Plot Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-farm-600" />
                Preferred Execution Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-farm-600" />
                Preferred Time Slot
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              >
                <option value="Early Morning (06:00 - 09:00)">Early Morning (06:00 - 09:00)</option>
                <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                <option value="Evening (16:00 - 19:00)">Evening (16:00 - 19:00)</option>
                <option value="Full Day Execution">Full Day Execution</option>
              </select>
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block font-bold text-slate-700 mb-2 text-xs">Request Urgency Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { level: 'LOW', label: 'Low', desc: 'Flexible within 5 days' },
                { level: 'NORMAL', label: 'Normal', desc: 'Standard turnaround' },
                { level: 'HIGH', label: 'High', desc: 'Required next 24-48 hrs' },
                { level: 'EMERGENCY', label: 'Emergency', desc: 'Immediate pest / harvest threat' },
              ].map((u) => (
                <button
                  key={u.level}
                  type="button"
                  onClick={() => setUrgencyLevel(u.level)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    urgencyLevel === u.level
                      ? u.level === 'EMERGENCY'
                        ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-600 font-bold'
                        : 'border-farm-600 bg-farm-50 text-farm-900 ring-1 ring-farm-600 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs block">{u.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{u.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-farm-600" />
                Farm Gate / Plot Location Address
              </label>
              <input
                type="text"
                required
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="e.g. Plot 42, North Acreage, Near Canal Gate"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Village & District</label>
              <input
                type="text"
                required
                value={villageDistrict}
                onChange={(e) => setVillageDistrict(e.target.value)}
                placeholder="e.g. Rampur, Ludhiana, Punjab"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Special Instructions / Crop Conditions (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sandy loam soil, needs deep ploughing before rain. Gate key with watchman..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none text-xs"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm"
            >
              Review Booking <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Review Service Request Summary</h3>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-farm-700 block">Selected Service</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{selectedItem?.name}</h4>
                <p className="text-slate-500 text-[11px]">{selectedCategory?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Rate</span>
                <span className="font-bold text-slate-800">₹{selectedItem?.basePrice} {selectedItem?.unitLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Land / Quantity</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {quantity} {selectedItem?.unitLabel}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Schedule Date</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{requestedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Time Slot</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{preferredTimeSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Urgency</span>
                <span className={`font-bold mt-0.5 block ${urgencyLevel === 'EMERGENCY' ? 'text-rose-600 font-extrabold' : 'text-slate-800'}`}>
                  {urgencyLevel}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Farm Plot Location</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {farmLocation}, {villageDistrict}
              </span>
            </div>

            {notes && (
              <div className="border-t border-slate-200 pt-3">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Special Notes</span>
                <p className="text-slate-700 italic mt-0.5">"{notes}"</p>
              </div>
            )}

            <div className="bg-emerald-100/80 p-4 rounded-xl border border-emerald-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-950 text-xs">Total Estimated Charges</span>
                <span className="text-[11px] text-emerald-800 block">Payment collected after provider verification / service completion</span>
              </div>
              <span className="text-2xl font-black text-emerald-950">₹{estimatedCost}</span>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-8 py-3 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white rounded-xl font-black text-xs flex items-center gap-2 transition shadow-lg shadow-farm-600/30"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Confirm & Dispatch Request
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && submittedReq && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">Service Request Dispatched!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your request for <span className="font-bold text-slate-900">{submittedReq.serviceItemName}</span> has been broadcast to regional certified service providers.
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-sm mx-auto font-mono text-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Tracking ID</span>
            <span className="text-base font-black text-farm-800 tracking-wider mt-1 block">
              {submittedReq.trackingNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigate('/farmer/requests')}
              className="px-6 py-2.5 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs transition shadow-md"
            >
              View in My Requests
            </button>
            <button
              onClick={() => navigate(`/track?id=${submittedReq.trackingNumber}`)}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Live Timeline Tracking
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
