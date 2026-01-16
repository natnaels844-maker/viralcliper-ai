
import React, { useState } from 'react';
import { ViralClip, YouTubeVideoMetadata, LocalizedVersion } from '../types';
import Button from './Button';
import { globalizeClip, generatePreviewTTS } from '../services/geminiService';

interface ClipStudioProps {
  clip: ViralClip;
  videoMetadata: YouTubeVideoMetadata;
  onClose: () => void;
  onSave: (updatedClip: ViralClip) => void;
}

const ClipStudio: React.FC<ClipStudioProps> = ({ clip, videoMetadata, onClose, onSave }) => {
  const [startTime, setStartTime] = useState(clip.startTime);
  const [endTime, setEndTime] = useState(clip.endTime);
  const [activeTab, setActiveTab] = useState<'script' | 'strategy' | 'global' | 'voice'>('script');
  const [isGlobalizing, setIsGlobalizing] = useState(false);
  const [localizedVersions, setLocalizedVersions] = useState<LocalizedVersion[]>(clip.localizedVersions || []);
  const [selectedVoice, setSelectedVoice] = useState(clip.selectedVoice || 'Kore');

  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  };

  const startSec = timeToSeconds(startTime);
  const endSec = timeToSeconds(endTime);
  const videoUrl = `https://www.youtube.com/embed/${videoMetadata.id}?start=${startSec}&end=${endSec}&autoplay=1&rel=0`;

  const handleGlobalize = async () => {
    setIsGlobalizing(true);
    const results = await globalizeClip(clip, ['Spanish', 'Hindi', 'Japanese']);
    setLocalizedVersions(results);
    setIsGlobalizing(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-7xl h-full bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in duration-300">
        <div className="flex-1 bg-black relative flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full aspect-[9/16] max-w-[320px] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <iframe src={videoUrl} className="w-full h-full object-cover scale-[1.8]" title="Clip Preview"></iframe>
            </div>
          </div>
          <div className="bg-slate-900/80 p-8 border-t border-white/5">
             <Button variant="primary" onClick={() => onSave({...clip, startTime, endTime, localizedVersions, selectedVoice})} className="w-full">
               Apply & Save Changes
             </Button>
          </div>
        </div>
        <div className="w-full lg:w-[480px] bg-slate-900 border-l border-white/5 p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-black">Viral Studio</h2>
            <div className="flex bg-slate-950 p-1 rounded-xl">
               <button onClick={() => setActiveTab('script')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${activeTab === 'script' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>SCRIPT</button>
               <button onClick={() => setActiveTab('global')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${activeTab === 'global' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>GLOBAL</button>
            </div>
            {activeTab === 'script' && (
              <div className="space-y-4">
                {clip.visualHooks.map((hook, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-white/5 text-xs">
                    <p className="text-indigo-400 font-bold mb-1">{hook.timestamp} - {hook.type}</p>
                    <p className="text-slate-300">{hook.action}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'global' && (
              <div className="space-y-4">
                <Button variant="secondary" onClick={handleGlobalize} loading={isGlobalizing} className="w-full">Generate Global Versions</Button>
                {localizedVersions.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-white/5">
                    <p className="text-emerald-400 font-bold text-xs uppercase">{v.language}</p>
                    <p className="text-white text-xs font-bold">{v.title}</p>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClipStudio;
