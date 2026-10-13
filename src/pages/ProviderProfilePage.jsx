import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Wrench, ShieldCheck, Save, Loader2, CheckCircle2, Phone, Building2 } from 'lucide-react';

export const ProviderProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    providerName: '',
    agencyName: '',
    contactPerson: '',
    contactPhone: '',
    serviceCategories: '',
    coverageDistricts: '',
    experienceYears: 0,
    availabilityStatus: 'AVAILABLE',
    gstOrLicenseNumber: '',
    equipmentInventorySummary: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/providers/profile');
        if (res.data.success && res.data.data) {
          setProfile({
            providerName: res.data.data.providerName || user?.name || '',
            agencyName: res.data.data.agencyName || '',
            contactPerson: res.data.data.contactPerson || '',
            contactPhone: res.data.data.contactPhone || user?.phone || '',
            serviceCategories: res.data.data.serviceCategories || '',
            coverageDistricts: res.data.data.coverageDistricts || '',
            experienceYears: res.data.data.experienceYears || 0,
            availabilityStatus: res.data.data.availabilityStatus || 'AVAILABLE',
            gstOrLicenseNumber: res.data.data.gstOrLicenseNumber || '',
            equipmentInventorySummary: res.data.data.equipmentInventorySummary || ''
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
      const res = await apiClient.put('/providers/profile', {
        ...profile,
        experienceYears: Number(profile.experienceYears)
      });
      if (res.data.success) {
        setSuccessMsg('Service provider agency profile updated successfully!');
        updateUserProfile(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Provider Agency & Equipment Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure agency operational regions, equipment fleet summary, and active availability
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading agency profile...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
          
          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Section 1 */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              Agency & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business / Agency Name</label>
                <input
                  type="text"
                  required
                  value={profile.agencyName}
                  onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Contact Person</label>
                <input
                  type="text"
                  required
                  value={profile.contactPerson}
                  onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={profile.contactPhone}
                  onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Availability</label>
                <select
                  value={profile.availabilityStatus}
                  onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-farm-800"
                >
                  <option value="AVAILABLE">AVAILABLE (Accepting Job Requests)</option>
                  <option value="BUSY">BUSY (High Demand / Full Capacity)</option>
                  <option value="OFFLINE">OFFLINE (Temporarily Inactive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Services & Coverage */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-600" />
              Service Offerings & Geographic Coverage
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Categories Provided (Codes)</label>
                <input
                  type="text"
                  value={profile.serviceCategories}
                  onChange={(e) => setProfile({ ...profile, serviceCategories: e.target.value })}
                  placeholder="MACHINERY, IRRIGATION, TRANSPORT, DRONE_SPRAY"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operational Coverage Districts</label>
                  <input
                    type="text"
                    value={profile.coverageDistricts}
                    onChange={(e) => setProfile({ ...profile, coverageDistricts: e.target.value })}
                    placeholder="Ludhiana, Jalandhar, Patiala"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Years of Agri Experience</label>
                  <input
                    type="number"
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN / Trade License Number</label>
                <input
                  type="text"
                  value={profile.gstOrLicenseNumber}
                  onChange={(e) => setProfile({ ...profile, gstOrLicenseNumber: e.target.value })}
                  placeholder="03AACCK1294F1Z3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Equipment & Machinery Fleet Inventory</label>
                <textarea
                  rows={3}
                  value={profile.equipmentInventorySummary}
                  onChange={(e) => setProfile({ ...profile, equipmentInventorySummary: e.target.value })}
                  placeholder="e.g. 4x John Deere 55HP Tractors, 2x Rotavators, 2x Combine Harvesters, 1x Laser Leveler"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-md shadow-amber-600/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Agency Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
