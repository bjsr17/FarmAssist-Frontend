import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Wrench, ArrowRight, Loader2 } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState('ROLE_FARMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
    // Farmer
    farmLocation: '',
    village: '',
    landAreaAcres: 5.0,
    primaryCrops: 'Wheat, Mustard',
    soilType: 'Alluvial Soil',
    irrigationSource: 'Tube Well',
    // Provider
    agencyName: '',
    contactPerson: '',
    serviceCategories: 'MACHINERY,IRRIGATION,TRANSPORT',
    coverageDistricts: '',
    experienceYears: 3,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      role,
      landAreaAcres: Number(formData.landAreaAcres),
      experienceYears: Number(formData.experienceYears)
    };

    const res = await register(payload);
    if (res.success) {
      if (role === 'ROLE_PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Top Branding */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-farm-600 flex items-center justify-center text-white shadow-xl shadow-farm-600/20 mx-auto mb-2">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Create FarmAssist Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with agricultural service networks across India
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-1 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setRole('ROLE_FARMER')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
              role === 'ROLE_FARMER'
                ? 'bg-white text-farm-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-farm-600" />
            Farmer / Cultivator
          </button>

          <button
            type="button"
            onClick={() => setRole('ROLE_PROVIDER')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
              role === 'ROLE_PROVIDER'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            Service Provider
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name / Head Farmer</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh@kisan.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile / Phone Number</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  required
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Ludhiana"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Punjab"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="141001"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-farm-500 outline-none"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'ROLE_FARMER' ? (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                <span className="font-bold text-emerald-900 block text-xs">🌾 Farm Land & Crop Specifications</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Land Area (Acres)</label>
                    <input
                      type="number"
                      step="0.5"
                      name="landAreaAcres"
                      value={formData.landAreaAcres}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Crops Cultivated</label>
                    <input
                      type="text"
                      name="primaryCrops"
                      value={formData.primaryCrops}
                      onChange={handleChange}
                      placeholder="Wheat, Paddy, Mustard"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
                    <input
                      type="text"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      placeholder="Alluvial / Clay Loam"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Irrigation Source</label>
                    <input
                      type="text"
                      name="irrigationSource"
                      value={formData.irrigationSource}
                      onChange={handleChange}
                      placeholder="Tube Well / Canal"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <span className="font-bold text-amber-900 block text-xs">🚜 Agency & Service Capabilities</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Agency / Business Name</label>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      placeholder="Kisan Machinery Hub"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Services Provided (comma separated)</label>
                  <input
                    type="text"
                    name="serviceCategories"
                    value={formData.serviceCategories}
                    onChange={handleChange}
                    placeholder="MACHINERY, IRRIGATION, TRANSPORT, DRONE_SPRAY"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white rounded-xl font-bold shadow-md shadow-farm-600/20 transition flex items-center justify-center gap-2 text-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register & Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-farm-600 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
