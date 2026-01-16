
import React, { useState } from 'react';
import Button from './Button';

const Settings: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [userRepoUrl, setUserRepoUrl] = useState('');

  const getFullGitCommand = () => {
    const url = userRepoUrl || 'https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git';
    // Single line command to avoid any multi-line copy issues
    return `git init && git add . && git commit -m "ViralClip Setup" && git branch -M main && git remote add origin ${url} && git push -u origin main --force`;
  };

  const steps = [
    {
      id: 1,
      title: "1. The Terminal Fix",
      icon: "fa-terminal",
      desc: "Stop the 'No such file' error.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase text-rose-400 mb-3">❌ The Wrong Way</h4>
              <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] text-rose-200 line-through opacity-50">
                https://github.com/user/repo.git
              </div>
              <p className="text-[9px] mt-3 text-rose-300/70 italic">Pasting just the link causes the "No such file" error.</p>
            </div>
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-3">✅ The Right Way</h4>
              <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] text-emerald-200">
                git remote add origin https://...
              </div>
              <p className="text-[9px] mt-3 text-emerald-300/70 italic">You must include the word <b>git</b> at the start.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Paste Your GitHub Repo Link Here:</label>
            <input 
              type="text" 
              placeholder="https://github.com/username/my-viral-app.git"
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-4 text-xs text-indigo-300 outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              value={userRepoUrl}
              onChange={(e) => setUserRepoUrl(e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "2. One-Click Setup",
      icon: "fa-copy",
      desc: "Run this command now.",
      content: (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative group">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Copy this entire block:</p>
              <button 
                onClick={() => navigator.clipboard.writeText(getFullGitCommand())}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-white text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                <i className="fas fa-copy mr-2"></i> COPY COMMAND
              </button>
            </div>
            <div className="bg-black/60 p-5 rounded-2xl border border-white/5 overflow-x-auto">
              <code className="text-[11px] text-indigo-300 whitespace-nowrap font-mono">
                {getFullGitCommand()}
              </code>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5">
            <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle text-indigo-400"></i> Next Steps:
            </h4>
            <ul className="text-[11px] text-slate-400 space-y-2 list-disc ml-4">
              <li>Open your <b>Terminal</b> window.</li>
              <li>Paste the command and press <b>Enter</b>.</li>
              <li>Refresh your GitHub page; your code will be there!</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "3. Host on Vercel",
      icon: "fa-rocket",
      desc: "Launch your public site.",
      content: (
        <div className="space-y-8 text-center py-6">
          <div className="flex justify-center">
            <div className="relative group">
               <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
                 <i className="fab fa-vercel text-slate-900 text-6xl"></i>
               </div>
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-2">Connect to Vercel</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-10 leading-relaxed">
              Import your new GitHub repository to Vercel and add your <span className="text-indigo-400 font-bold">API_KEY</span>.
            </p>
            <Button variant="primary" className="w-full max-w-sm rounded-2xl py-4 shadow-xl" onClick={() => window.open('https://vercel.com/new', '_blank')}>
               Open Vercel Dashboard <i className="fas fa-external-link-alt ml-2 text-xs"></i>
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <div className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter">Setup Wizard</h2>
          <p className="text-slate-400 max-w-xl">Everything you need to fix terminal errors and launch your AI Clipper.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-white/5">
          <div className="px-4 py-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white">Guide v2.0</div>
          <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">Live Support</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden ${
                activeStep === step.id 
                  ? 'bg-indigo-600 border-indigo-400 shadow-2xl scale-[1.02]' 
                  : 'bg-slate-900/50 border-white/5 hover:border-white/10 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                  activeStep === step.id ? 'bg-white text-indigo-600' : 'bg-slate-800 text-slate-500'
                }`}>
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <div>
                  <h3 className={`font-black text-sm uppercase tracking-wider ${activeStep === step.id ? 'text-white' : 'text-slate-300'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-[10px] font-medium mt-1 ${activeStep === step.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8">
          <div className="glass p-8 md:p-12 rounded-[4rem] border-white/5 min-h-[580px] flex flex-col justify-between shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
            
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-500/20">
                   Progress: {Math.round((activeStep / 3) * 100)}%
                 </span>
              </div>
              <h3 className="text-3xl font-black mb-8 tracking-tight">{steps[activeStep-1].title.split('. ')[1]}</h3>
              {steps[activeStep-1].content}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between relative z-10">
              <Button 
                variant="ghost" 
                disabled={activeStep === 1} 
                onClick={() => setActiveStep(prev => prev - 1)}
                className="w-full sm:w-auto text-xs uppercase tracking-widest font-black opacity-60 hover:opacity-100"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back
              </Button>
              <div className="flex gap-3">
                 {[1,2,3].map(i => (
                   <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${activeStep === i ? 'w-10 bg-indigo-500' : 'bg-slate-800'}`}></div>
                 ))}
              </div>
              <Button 
                variant="primary" 
                onClick={() => activeStep < 3 ? setActiveStep(prev => prev + 1) : null}
                className="w-full sm:w-auto rounded-2xl px-12 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
              >
                {activeStep === 3 ? "Launch Ready" : "Continue"} <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
