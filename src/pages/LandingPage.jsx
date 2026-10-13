import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Tractor, 
  Droplets, 
  Truck, 
  Sprout, 
  FlaskConical, 
  Plane, 
  Wheat, 
  Warehouse, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Search, 
  Users, 
  Sparkles,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  const { user, isFarmer, isProvider, isAdmin } = useAuth();

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isProvider) return '/provider/dashboard';
    return '/farmer/dashboard';
  };

  const services = [
    { icon: Tractor, title: 'Tractor & Machinery', desc: '55HP 4WD tractors, laser land levelers, rotavators, and deep ploughing on demand.', color: 'from-emerald-500 to-green-700' },
    { icon: Droplets, title: 'Smart Irrigation', desc: 'Precision drip irrigation, solar water pump setup, and canal line piping.', color: 'from-sky-500 to-blue-700' },
    { icon: Plane, title: 'Drone Spraying', desc: 'AI-guided aerial spraying for nano urea and organic pesticides in under 8 mins/acre.', color: 'from-indigo-500 to-purple-700' },
    { icon: Truck, title: 'Mandi Transport', desc: 'Farm-to-Mandi grain freight, 5-ton/10-ton haulers, and cold chain refrigerated vans.', color: 'from-amber-500 to-orange-700' },
    { icon: FlaskConical, title: 'Soil Testing Lab', desc: '14-parameter NPK, pH, and micronutrient soil testing with doorstep sample pickup.', color: 'from-teal-500 to-emerald-700' },
    { icon: Wheat, title: 'Harvesting Crew', desc: 'Combine harvesters with straw reapers for wheat and paddy with zero grain loss.', color: 'from-yellow-500 to-amber-700' },
  ];

  const steps = [
    { num: '01', title: 'Choose Agri Service', desc: 'Browse certified agricultural equipment, inputs, logistics, and drone services.' },
    { num: '02', title: 'Schedule & Book', desc: 'Set farm plot location, area/quantity, preferred time slot, and urgency level.' },
    { num: '03', title: 'Live Tracking', desc: 'Track provider dispatch, on-site arrival, and machine operations in real-time.' },
    { num: '04', title: 'Verify & Settle', desc: 'Review completed work, download invoice receipt, and rate service quality.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-farm-900 via-emerald-950 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3ca860_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Digital Agricultural Service & Request Infrastructure
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-6">
              Empowering Farmers with On-Demand <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 bg-clip-text text-transparent">Agri Services</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              Eliminate phone tag and manual logbooks. Request heavy machinery, smart drip irrigation, drone spraying, soil health tests, and crop logistics with guaranteed pricing and live tracking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to={getDashboardPath()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-farm-600 hover:bg-farm-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  Enter Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/farmer/book"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-farm-600 hover:bg-farm-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    Request a Service Now <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/catalog"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/20 flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    Explore Service Catalog
                  </Link>
                </>
              )}

              <Link
                to="/track"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 font-semibold text-sm transition border border-emerald-800/60 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                Track Request ID
              </Link>
            </div>

            {/* Quick Stats Strip */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                <div className="text-xs text-slate-300 mt-0.5">Verified Service Providers</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">&lt; 8 Mins</div>
                <div className="text-xs text-slate-300 mt-0.5">Per Acre Drone Spraying</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">24/7</div>
                <div className="text-xs text-slate-300 mt-0.5">Automated Dispatch & Tracking</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹0</div>
                <div className="text-xs text-slate-300 mt-0.5">Hidden Booking Charges</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-farm-600 mb-2">
            Integrated Agricultural Catalog
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything Your Farm Needs in One Platform
          </h3>
          <p className="text-slate-600 text-sm mt-3">
            From pre-sowing soil prep to post-harvest cold storage, access certified agricultural machinery and field technicians on demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-farm-400 hover:shadow-xl hover:shadow-farm-600/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-farm-700 transition">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-farm-700">
                  <Link to="/catalog" className="flex items-center gap-1 hover:gap-2 transition-all">
                    View Services & Rates <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-farm-600 mb-2">
              Simple 4-Step Process
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              How FarmAssist Streamlines Service Delivery
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-sm">
                <span className="text-3xl font-black text-slate-200 block mb-2">{step.num}</span>
                <h4 className="font-bold text-slate-900 text-sm mb-2">{step.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-farm-800 to-emerald-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-black sm:text-4xl text-white">
            Ready to Digitize Your Agricultural Operations?
          </h2>
          <p className="text-slate-200 text-sm leading-relaxed">
            Join thousands of progressive farmers and agricultural service providers modernizing farming logistics today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg"
            >
              Register as Farmer
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition border border-white/20"
            >
              Register as Service Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
