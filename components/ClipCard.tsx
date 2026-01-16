
import React, { useState } from 'react';
import { ViralClip, YouTubeVideoMetadata } from '../types';
import Button from './Button';

interface ClipCardProps {
  clip: ViralClip;
  videoMetadata: YouTubeVideoMetadata;
  onPublish: (id: string) => void;
  onSchedule: (id: string, time: string) => void;
  isPublishing: boolean;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip, videoMetadata, onPublish, onSchedule, isPublishing }) => {
  const isPublished = clip.status === 'published';
  const isScheduled = clip.status === 'scheduled';
  
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'overlays'>('info');

  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  };

  const startSeconds = timeToSeconds(clip.startTime);
  const previewUrl = `https://www.youtube.com/watch?v=${videoMetadata.id}&t=${startSeconds}s`;

  const handleConfirmSchedule = () => {
    if (scheduledDate) {
      onSchedule(clip.id, scheduledDate);
      setShowSchedulePicker(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`glass rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 hover:border-indigo-500/50 transition-all duration-500 group h-full shadow-xl`}>
      <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
        <img 
          src={`https://img.youtube.com/vi/${videoMetadata.id}/maxresdefault.jpg`} 
          alt={clip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
          {clip.suggestedCaptions?.[0] && (
            <div className="bg-white text-slate-950 font-black text-xs px-3 py-2 rounded-lg shadow-2xl transform -rotate-2 animate-bounce">
              {clip.suggestedCaptions[0].text.toUpperCase()}
            </div>
          )}
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-slate-950/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {clip.startTime}
          </div>
        </div>

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-indigo-600 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-indigo-500/20 text-white">
            {clip.viralScore}% VIRAL
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <h3 className="font-black text-lg leading-tight mb-2 line-clamp-2">{clip.title}</h3>
          <div className="flex gap-1 overflow-hidden">
            {clip.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[9px] text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-md font-bold">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeTab === 'info' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            STRATEGY
          </button>
          <button 
            onClick={() => setActiveTab('overlays')}
            className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeTab === 'overlays' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            AI OVERLAYS
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">"{clip.reasoning}"</p>
            {isScheduled && clip.scheduledTime && (
              <div className="flex items-center gap-2 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                <i className="fas fa-clock text-amber-500 text-[10px]"></i>
                <p className="text-[10px] text-amber-200 font-bold uppercase tracking-tight">Post: {formatDate(clip.scheduledTime)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {clip.suggestedCaptions.map((cap, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md">{cap.timing}</span>
                <p className="text-[10px] text-slate-300 font-bold leading-tight">{cap.text}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-2">
          {showSchedulePicker ? (
            <div className="space-y-3 animate-in fade-in zoom-in duration-200">
              <input 
                type="datetime-local" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 text-[10px]" onClick={() => setShowSchedulePicker(false)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1 text-[10px] rounded-xl" disabled={!scheduledDate} onClick={handleConfirmSchedule}>Confirm</Button>
              </div>
            </div>
          ) : isPublished ? (
            <Button variant="success" size="sm" className="w-full text-[10px] font-black rounded-xl" onClick={() => window.open(clip.publishedUrl, '_blank')}>
              <i className="fab fa-youtube mr-2"></i> VIEW LIVE SHORT
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" className="text-[10px] border border-white/5 rounded-xl" onClick={() => window.open(previewUrl, '_blank')}>
                <i className="fas fa-play mr-2"></i> PREVIEW
              </Button>
              <Button variant="secondary" size="sm" className="text-[10px] border border-white/5 rounded-xl" onClick={() => setShowSchedulePicker(true)} disabled={isScheduled}>
                <i className="fas fa-calendar-alt mr-2"></i> {isScheduled ? 'EDIT TIME' : 'SCHEDULE'}
              </Button>
              <Button variant="primary" size="sm" className="col-span-2 text-[10px] font-black rounded-xl py-3" loading={isPublishing} onClick={() => onPublish(clip.id)}>
                <i className="fas fa-bolt mr-2"></i> {isScheduled ? 'PUBLISH NOW' : 'GENERATE & POST'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClipCard;
