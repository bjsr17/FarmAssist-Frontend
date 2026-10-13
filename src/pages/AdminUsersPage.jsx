import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { 
  Users, 
  Wrench, 
  ShieldCheck, 
  Check, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Loader2, 
  Star,
  Sprout,
  CheckCircle2
} from 'lucide-react';

export const AdminUsersPage = () => {
  const [activeTab, setActiveTab] = useState('FARMERS');
  const [farmers, setFarmers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const [fRes, pRes] = await Promise.all([
        apiClient.get('/admin/farmers'),
        apiClient.get('/admin/providers')
      ]);

      if (fRes.data.success) setFarmers(fRes.data.data);
      if (pRes.data.success) setProviders(pRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleVerification = async (providerId, currentVerified) => {
    try {
      const res = await apiClient.patch(`/admin/providers/${providerId}/verify`, {
        verified: !currentVerified
      });
      if (res.data.success) {
        loadUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification update failed');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">User & Stakeholder Registry</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Directory of registered farmers, verified agricultural machinery vendors, and service agencies
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 max-w-sm">
        <button
          onClick={() => setActiveTab('FARMERS')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'FARMERS'
              ? 'bg-farm-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          Farmers ({farmers.length})
        </button>

        <button
          onClick={() => setActiveTab('PROVIDERS')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'PROVIDERS'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Providers ({providers.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-xs text-slate-500">Loading user records...</span>
        </div>
      ) : activeTab === 'FARMERS' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Farmer Name</th>
                  <th className="py-3.5 px-5">Contact Info</th>
                  <th className="py-3.5 px-5">Village & District</th>
                  <th className="py-3.5 px-5">Landholding</th>
                  <th className="py-3.5 px-5">Primary Crops</th>
                  <th className="py-3.5 px-5">Soil & Irrigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {farmers.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-sm">{f.farmerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: #{f.userId}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800">{f.phone}</div>
                      <div className="text-[11px] text-slate-400">{f.email}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-800">{f.village || 'N/A'}, {f.district}</div>
                      <div className="text-[11px] text-slate-400">{f.state} - {f.pincode}</div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900">
                      {f.landAreaAcres} Acres
                    </td>
                    <td className="py-4 px-5 text-slate-700">
                      {f.primaryCrops || 'Various Crops'}
                    </td>
                    <td className="py-4 px-5 text-[11px] text-slate-600">
                      <div>Soil: <strong>{f.soilType || 'Loam'}</strong></div>
                      <div>Water: <strong>{f.irrigationSource || 'Canal/TubeWell'}</strong></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Agency & Provider</th>
                  <th className="py-3.5 px-5">Contact Details</th>
                  <th className="py-3.5 px-5">Services Offered</th>
                  <th className="py-3.5 px-5">Coverage & Experience</th>
                  <th className="py-3.5 px-5">Rating</th>
                  <th className="py-3.5 px-5">Availability</th>
                  <th className="py-3.5 px-5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        {p.agencyName || p.providerName}
                        {p.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Provider" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">Contact: {p.contactPerson}</div>
                      {p.gstOrLicenseNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">GST: {p.gstOrLicenseNumber}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800">{p.contactPhone || p.phone}</div>
                      <div className="text-[11px] text-slate-400">{p.email}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-mono text-[11px] bg-amber-50 text-amber-900 px-2 py-1 rounded border border-amber-200">
                        {p.serviceCategories}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-800">{p.coverageDistricts}</div>
                      <div className="text-[11px] text-slate-400">{p.experienceYears} Years Exp.</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-900">⭐ {p.ratingAvg || 4.8}</span>
                      <span className="text-[10px] text-slate-400 block">({p.ratingCount || 0} reviews)</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.availabilityStatus}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleToggleVerification(p.id, p.isVerified)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                          p.isVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm'
                        }`}
                      >
                        {p.isVerified ? 'Verified ✓' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
