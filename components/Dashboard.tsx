
import React from 'react';
import { UserAccount, ViralClip } from '../types';

interface DashboardProps {
  user: UserAccount;
  publishedClips: ViralClip[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, publishedClips }) => {
  const stats = [
    { label: 'Total Views', value: '1.2M', icon: 'fa-eye', color: 'text-indigo-400' },
    { label: 'Subscribers Gained', value: '+452', icon: 'fa-users', color: 'text-emerald-400' },
    { label: 'Avg. Retention', value: '84%', icon: 'fa-chart-pie', color: 'text-purple-400' },
    { label: 'Shorts Published', value: publishedClips.length.toString(), icon: 'fa-clapperboard', color: 'text-rose-400' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pt-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Channel Overview</h2>
          <p className="text-slate-500">Real-time performance for <span className="text-indigo-400 font-bold">{user.channelName || 'Unconnected Channel'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
            <p className="text-2xl font-black mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-white/5">
        <h3 className="font-bold text-lg mb-6">Recent Publications</h3>
        <div className="space-y-4">
          {publishedClips.length > 0 ? (
            publishedClips.map((clip) => (
              <div key={clip.id} className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                <div className="flex-1">
                  <p className="text-sm font-bold truncate">{clip.title}</p>
                  <p className="text-[10px] text-slate-500">{clip.startTime} • {clip.status}</p>
                </div>
                {clip.publishedUrl && (
                  <a href={clip.publishedUrl} target="_blank" className="text-xs text-indigo-400 hover:underline">View</a>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No shorts published yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
