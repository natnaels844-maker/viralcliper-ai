
export interface YouTubeVideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
}

export interface SuggestedCaption {
  text: string;
  timing: string;
  style: 'impact' | 'question' | 'highlight';
}

export interface VisualHook {
  timestamp: string;
  action: string;
  type: 'zoom' | 'cut' | 'overlay' | 'transition';
}

export interface LocalizedVersion {
  language: string;
  title: string;
  description: string;
  captions: SuggestedCaption[];
}

export interface ViralClip {
  id: string;
  startTime: string; 
  endTime: string;
  durationSeconds: number;
  title: string;
  description: string;
  viralScore: number; 
  reasoning: string;
  status: 'pending' | 'processing' | 'ready' | 'publishing' | 'published' | 'scheduled';
  tags: string[];
  suggestedCaptions: SuggestedCaption[];
  visualHooks: VisualHook[];
  platformTarget: 'Shorts' | 'TikTok' | 'Reels' | 'Universal';
  publishedUrl?: string;
  scheduledTime?: string;
  localizedVersions?: LocalizedVersion[];
  selectedVoice?: string;
}

export interface UserAccount {
  name: string;
  email: string;
  avatar: string;
  isConnected: boolean;
  channelName?: string;
  subscribers?: string;
  handle?: string;
}

export type AppView = 'clipper' | 'dashboard' | 'settings';
