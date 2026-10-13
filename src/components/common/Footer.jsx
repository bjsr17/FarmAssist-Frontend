import React from 'react';
import { Sprout, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-farm-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              FarmAssist
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Farmer Service and Agricultural Request Management System connecting rural farming communities with certified service providers, heavy machinery, and field agronomists.
            </p>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Key Agricultural Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/catalog" className="hover:text-emerald-400 transition">Tractor & Heavy Machinery</Link></li>
              <li><Link to="/catalog" className="hover:text-emerald-400 transition">Precision Drip Irrigation</Link></li>
              <li><Link to="/catalog" className="hover:text-emerald-400 transition">AI Drone Spraying (Urea/Pesticide)</Link></li>
              <li><Link to="/catalog" className="hover:text-emerald-400 transition">Farm-to-Mandi Transport</Link></li>
              <li><Link to="/catalog" className="hover:text-emerald-400 transition">Soil Health Card & Testing</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">System Access</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/track" className="hover:text-emerald-400 transition">Live Request Tracking</Link></li>
              <li><Link to="/catalog" className="hover:text-emerald-400 transition">Service Catalog & Rates</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Farmer & Provider Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition">Register as Service Provider</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Kisan Helpline</h4>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1800-180-1551 (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>support@farmassist.agri.gov.in</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Central Agricultural Data Center, Delhi</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} FarmAssist – Farmer Service and Agricultural Request Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            Empowering Farmers with Digital Agricultural Infrastructure
          </div>
        </div>
      </div>
    </footer>
  );
};
