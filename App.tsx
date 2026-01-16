
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import VideoInput from './components/VideoInput';
import ClipCard from './components/ClipCard';
import Button from './components/Button';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import ClipStudio from './components/ClipStudio';
import { UserAccount, YouTubeVideoMetadata, ViralClip, AppView } from './types';
import { fetchVideoMetadata, publishToYouTube, scheduleToYouTube } from './services/youtubeService';
import { analyzeVideoForClips } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('clipper');
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('vc_user');
    return saved ? JSON.parse(saved) : {
      name: "",
      email: "",
      avatar: "",
      isConnected: false
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideoMetadata | null>(null);
  const [clips, setClips] = useState<ViralClip[]>([]);
  const [editingClip, setEditingClip] = useState<ViralClip | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [autoPublish, setAutoPublish] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'|'info'} | null>(null);
  
  const [customChannelName, setCustomChannelName] = useState('');
  const [customHandle, setCustomHandle] = useState('');

  useEffect(() => {
    if (user.isConnected) {
      localStorage.setItem('vc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vc_user');
    }
  }, [user]);

  const handleConnect = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const confirmAuth = () => {
    if (!customChannelName) return;
    
    setIsLoading(true);
    setLoadingStep('Authenticating with YouTube API...');
    setShowAuthModal(false);
    
    setTimeout(() => {
      const newUser: UserAccount = {
        name: customChannelName,
        email: `${customChannelName.toLowerCase().replace(/\s/g, '.')}@gmail.com`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customChannelName)}&background=ef4444&color=fff`,
        isConnected: true,
        channelName: customChannelName,
        subscribers: (Math.floor(Math.random() * 50) + 1) + "K",
        handle: customHandle.startsWith('@') ? customHandle : `@${customHandle || customChannelName.toLowerCase().replace(/\s/g, '_')}`
      };

      setUser(newUser);
      setIsLoading(false);
      setLoadingStep('');
      setToast({ message: `Successfully linked to ${newUser.channelName}`, type: 'success' });
    }, 1200);
  };

  const handleLogout = () => {
    setUser({ name: "", email: "", avatar: "", isConnected: false });
    setCustomChannelName('');
    setCustomHandle('');
    setToast({ message: "Account Disconnected", type: 'info' });
  };

  const handleProcessVideo = async (url: string) => {
    setIsLoading(true);
    setClips([]);
    
    try {
      setLoadingStep('Fetching Video Metadata...');
      const metadata = await fetchVideoMetadata(url);
      setActiveVideo(metadata);
      
      setLoadingStep('Gemini is analyzing virality...');
      const suggestedClips = await analyzeVideoForClips(metadata);
      setClips(suggestedClips);

      if (autoPublish && user.isConnected) {
        setToast({ message: "Auto-publish sequence started", type: 'info' });
        suggestedClips.forEach((clip, index) => {
            setTimeout(() => {
                handlePublishClip(clip.id, true);
            }, (index + 1) * 6000);
        });
      }
    } catch (error) {
      console.error("Error processing video:", error);
      setToast({ message: "Error: Could not access video", type: 'error' });
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handlePublishClip = async (clipId: string, isAuto: boolean = false) => {
    if (!user.isConnected) {
      setShowAuthModal(true);
      return;
    }

    setPublishingId(clipId);
    try {
      const result = await publishToYouTube(clipId);
      if (result.success) {
        setClips(prev => prev.map(c => 
          c.id === clipId ? { ...c, status: 'published', publishedUrl: result.url } : c
        ));
        if (!isAuto) setToast({ message: "Short published successfully!", type: 'success' });
      }
    } catch (error) {
      setToast({ message: "Publishing failed", type: 'error' });
    } finally {
      setPublishingId(null);
    }
  };

  const handleScheduleClip = async (clipId: string, scheduledTime: string) => {
    if (!user.isConnected) {
      setShowAuthModal(true);
      return;
    }

    setPublishingId(clipId);
    try {
      const result = await scheduleToYouTube(clipId, scheduledTime);
      if (result.success) {
        setClips(prev => prev.map(c => 
          c.id === clipId ? { ...c, status: 'scheduled', scheduledTime } : c
        ));
        setToast({ message: "Short scheduled successfully!", type: 'success' });
      }
    } catch (error) {
      setToast({ message: "Scheduling failed", type: 'error' });
    } finally {
      setPublishingId(null);
    }
  };

  const handleUpdateClip = (updated: ViralClip) => {
    setClips(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingClip(null);
    setToast({ message: "Studio changes saved", type: 'success' });
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard user={user} publishedClips={clips.filter(c => c.status === 'published' || c.status === 'scheduled')} />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <>
            <section className="text-center mb-16 pt-12 animate-in fade-in duration-1000">
              <div className="inline-flex flex-wrap items-center justify-center gap-4 mb-8">
                <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  <i className="fas fa-sparkles"></i> AI-Powered Virality
                </div>
                <button 
                  onClick={() => setView('settings')}
                  className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/20 transition-all"
                >
                  <i className="fas fa-rocket mr-2"></i> Setup Deployment
                </button>
              </div>
              
              <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
                CLIP ONCE.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-rose-400">GROW FOREVER.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium px-4">
                Automate your YouTube growth. Our AI finds the perfect hooks from your long videos and publishes them as Shorts while you sleep.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 px-4">
                <div className="flex items-center gap-3 glass px-6 py-4 rounded-2xl border-white/5 shadow-2xl transition-all hover:border-indigo-500/30 w-full sm:w-auto">
                    <div className="relative inline-flex items-center cursor-pointer" onClick={() => setAutoPublish(!autoPublish)}>
                        <div className={`w-12 h-6 transition-colors rounded-full ${autoPublish ? 'bg-indigo-600' : 'bg-slate-700'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${autoPublish ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-200">Auto-Publish Mode</p>
                      <p className="text-[10px] text-slate-500">Auto-post clips as they are found</p>
                    </div>
                </div>
                
                <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                   <div className="flex -space-x-3">
                     {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-8 h-8 rounded-full ring-2 ring-slate-950" />)}
                   </div>
                   <span className="ml-2">Used by <span className="text-white font-bold">15,000+</span> creators</span>
                </div>
              </div>
            </section>

            <VideoInput onProcess={handleProcessVideo} isLoading={isLoading} />
            
            {isLoading && loadingStep && (
              <div className="max-w-md mx-auto mb-16 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 px-6">
                <div className="relative w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 animate-progress-indeterminate w-full origin-left"></div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] text-center">
                  <i className="fas fa-brain-circuit animate-bounce"></i> {loadingStep}
                </div>
              </div>
            )}

            {activeVideo && clips.length > 0 && (
              <div className="max-w-7xl mx-auto mb-12 animate-in slide-in-from-bottom-10 duration-700 px-4">
                <div className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center">
                    <div className="w-full lg:w-1/3 text-left">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 flex items-center gap-2">
                         <i className="fas fa-chart-line"></i> Virality Forecast
                       </h4>
                       <h3 className="text-2xl font-black mb-4">"The Engagement Surge"</h3>
                       <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                         Gemini has extracted segments with the highest potential for retention. These moments trigger the 'swipe-back' behavior in viewers.
                       </p>
                    </div>
                    <div className="hidden lg:block w-px h-48 bg-slate-800"></div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
                       {[
                         { label: 'Retention', val: '94%', color: 'indigo' },
                         { label: 'Est. Subs', val: '+1.2K', color: 'purple' },
                         { label: 'Click Rate', val: '9.2%', color: 'emerald' },
                         { label: 'Viral Rank', val: '#1', color: 'rose' }
                       ].map((stat, i) => (
                         <div key={i} className="text-center p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-slate-900/40 border border-white/5">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                           <p className={`text-lg md:text-xl font-black text-${stat.color}-400`}>{stat.val}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {clips.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4">
                {clips.map((clip) => (
                  <div key={clip.id} className="relative group/studio">
                    <ClipCard 
                      clip={clip} 
                      videoMetadata={activeVideo!}
                      onPublish={handlePublishClip} 
                      onSchedule={handleScheduleClip}
                      isPublishing={publishingId === clip.id}
                    />
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 lg:group-hover/studio:opacity-100 transition-all pointer-events-none lg:group-hover/studio:pointer-events-auto rounded-[2.5rem] backdrop-blur-sm">
                      <Button variant="primary" onClick={() => setEditingClip(clip)} className="rounded-full px-8 py-3">
                        <i className="fas fa-wand-magic-sparkles mr-2"></i> Edit Studio
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-32 md:pb-20 bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <Header 
        user={user} 
        currentView={view} 
        onViewChange={setView} 
        onConnect={handleConnect} 
        onLogout={handleLogout} 
      />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {editingClip && activeVideo && (
        <ClipStudio 
          clip={editingClip} 
          videoMetadata={activeVideo} 
          onClose={() => setEditingClip(null)} 
          onSave={handleUpdateClip}
        />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setShowAuthModal(false)}></div>
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
            <div className="p-10 flex flex-col items-center text-center text-slate-900">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-500/20">
                <i className="fab fa-youtube text-white text-3xl"></i>
              </div>
              
              <h3 className="text-3xl font-black mb-2 tracking-tight">Connect YouTube</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[280px]">Grant access to publish Shorts directly to your channel.</p>
              
              <div className="w-full space-y-4">
                <div className="text-left">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Channel Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. My Awesome Channel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-bold"
                    value={customChannelName}
                    onChange={(e) => setCustomChannelName(e.target.value)}
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Channel Handle</label>
                  <input 
                    type="text" 
                    placeholder="e.g. @mychannel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-bold"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                  />
                </div>
                
                <div className="pt-6 flex gap-4">
                  <button 
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl transition-all"
                    onClick={() => setShowAuthModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={`flex-[2] py-4 rounded-2xl font-black transition-all ${customChannelName ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    disabled={!customChannelName}
                    onClick={confirmAuth}
                  >
                    Authorize Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        {renderContent()}
      </main>

      <footer className="mt-40 border-t border-slate-900 bg-slate-950/50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl">
              <i className="fas fa-bolt text-white text-xl"></i>
            </div>
            <span className="font-black text-2xl tracking-tighter">ViralClip.AI</span>
          </div>
          <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto">Scaling your channel with advanced AI automation.</p>
          <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em]">© 2025 ViralClip AI Labs</p>
        </div>
      </footer>

      <style>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.6); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 2s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
