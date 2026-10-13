import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  UserCheck, 
  PlayCircle,
  Eye
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Pending Claim / Review'
        };
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Eye,
          label: 'Under Review'
        };
      case 'ACCEPTED':
      case 'ASSIGNED':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: UserCheck,
          label: 'Provider Assigned'
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse',
          icon: PlayCircle,
          label: 'In Progress'
        };
      case 'COMPLETED':
        return {
          bg: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle2,
          label: 'Completed'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-300',
          icon: XCircle,
          label: 'Cancelled'
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertCircle,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
          label: status || 'Unknown'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
