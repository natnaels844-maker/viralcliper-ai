
import React from 'react';
import { UserAccount, AppView } from '../types';
import Button from './Button';

interface HeaderProps {
  user: UserAccount;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onConnect: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onViewChange, onConnect, onLogout }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5 h-20 flex items-center px-4 md:px-12 justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('clipper')}>
        <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
          <i className="fas fa-bolt text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight hidden xs:block">
          ViralClip<span className="text-indigo-500">.AI</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => onViewChange('clipper')} className={`transition-colors ${currentView === 'clipper' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Clipper</button>
          <button onClick={() => onViewChange('dashboard')} className={`transition-colors ${currentView === 'dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => onViewChange('settings')} className={`transition-colors ${currentView === 'settings' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Settings</button>
        </nav>

        {user.isConnected ? (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-100">{user.channelName}</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-wider">{user.subscribers} Subscribers</p>
            </div>
            <img src={user.avatar} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-indigo-500 p-0.5 cursor-pointer" onClick={onLogout} />
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={onConnect} className="rounded-full px-4 md:px-6 text-[10px] md:text-xs">
            Connect
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
