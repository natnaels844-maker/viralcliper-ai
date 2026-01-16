
import React, { useState } from 'react';
import Button from './Button';

interface VideoInputProps {
  onProcess: (url: string) => void;
  isLoading: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onProcess, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onProcess(url);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        <div className="relative glass flex flex-col md:flex-row p-3 gap-3 rounded-2xl">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fab fa-youtube text-red-500 text-xl"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 placeholder-slate-500 transition-all"
              placeholder="Paste YouTube long-form video link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            size="lg" 
            loading={isLoading} 
            className="md:w-48 h-[60px]"
          >
            {isLoading ? 'Analyzing...' : 'Auto-Clip Now'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-center text-slate-500 text-sm">
        Supports URLs like: <span className="text-indigo-400">youtube.com/watch?v=...</span> or <span className="text-indigo-400">youtu.be/...</span>
      </p>
    </div>
  );
};

export default VideoInput;
