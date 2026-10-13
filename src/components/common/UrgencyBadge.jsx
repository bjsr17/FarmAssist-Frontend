import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, ArrowDown } from 'lucide-react';

export const UrgencyBadge = ({ level }) => {
  switch (level) {
    case 'EMERGENCY':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-600 text-white animate-bounce">
          <Flame className="w-3 h-3" />
          EMERGENCY
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3 h-3" />
          High Urgency
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
          <ArrowDown className="w-3 h-3" />
          Low
        </span>
      );
    case 'NORMAL':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Normal
        </span>
      );
  }
};
