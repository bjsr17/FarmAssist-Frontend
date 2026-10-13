import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Sprout, Save, Loader2, CheckCircle2 } from 'lucide-react';

export const FarmerProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    farmerName: '',
    phone: '',
    farmLocation: '',
    village: '',
    talukOrBlock: '',
    district: '',
    state: '',
    pincode: '',
    landAreaAcres: 5.0,
    primaryCrops: '',
    soilType: '',
    irrigationSource: '',
    kisanCardNumber: '',
    additionalDetails: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/farmers/profile');
        if (res.data.success && res.data.data) {
          setProfile({
            farmerName: res.data.data.farmerName || user?.name || '',
            phone: res.data.data.phone || user?.phone || '',
            farmLocation: res.data.data.farmLocation || '',
            village: res.data.data.village || '',
            talukOrBlock: res.data.data.talukOrBlock || '',
            district: res.data.data.district || '',
            state: res.data.data.state || '',
            pincode: res.data.data.pincode || '',
            landAreaAcres: res.data.data.landAreaAcres || 5.0,
            primaryCrops: res.data.data.primaryCrops || '',
            soilType: res.data.data.soilType || '',
            irrigationSource: res.data.data.irrigationSource || '',
            kisanCardNumber: res.data.data.kisanCardNumber || '',
            additionalDetails: res.data.data.additionalDetails || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await apiClient.put('/farmers/profile', {
        ...profile,
        landAreaAcres: Number(profile.landAreaAcres)
      });
      if (res.data.success) {
        setSuccessMsg('Farmer profile and acreage details saved successfully!');
        updateUserProfile(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Farmer & Landholding Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Maintain your agricultural profile, Kisan Credit Card info, and irrigation specifics
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-farm-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading farm profile...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
          
          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Section 1: Farmer Personal Details */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-farm-600" />
              Personal & Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.farmerName}
                  onChange={(e) => setProfile({ ...profile, farmerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-farm-600" />
              Farm Location & Jurisdiction
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm Plot Address / Gate</label>
                <input
                  type="text"
                  value={profile.farmLocation}
                  onChange={(e) => setProfile({ ...profile, farmLocation: e.target.value })}
                  placeholder="e.g. Plot 42, North Acreage, Near Canal Sluice"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={profile.village}
                    onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taluk / Block</label>
                  <input
                    type="text"
                    value={profile.talukOrBlock}
                    onChange={(e) => setProfile({ ...profile, talukOrBlock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Crop & Agronomy */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-farm-600" />
              Agronomy & Land Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Landholding (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.landAreaAcres}
                  onChange={(e) => setProfile({ ...profile, landAreaAcres: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Crops</label>
                <input
                  type="text"
                  value={profile.primaryCrops}
                  onChange={(e) => setProfile({ ...profile, primaryCrops: e.target.value })}
                  placeholder="Wheat, Basmati Paddy, Mustard"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
                <input
                  type="text"
                  value={profile.soilType}
                  onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
                  placeholder="Alluvial Loam, Black Cotton, Red Soil"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Irrigation Source</label>
                <input
                  type="text"
                  value={profile.irrigationSource}
                  onChange={(e) => setProfile({ ...profile, irrigationSource: e.target.value })}
                  placeholder="Submersible Borewell, Canal Grid, Solar Drip"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Kisan Card */}
          <div className="pt-4 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kisan Credit Card (KCC) Number</label>
              <input
                type="text"
                value={profile.kisanCardNumber}
                onChange={(e) => setProfile({ ...profile, kisanCardNumber: e.target.value })}
                placeholder="KCC-PB-2024-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-md shadow-farm-600/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Farm Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
