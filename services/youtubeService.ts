
import { YouTubeVideoMetadata } from "../types";

export const fetchVideoMetadata = async (url: string): Promise<YouTubeVideoMetadata> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1500));
  
  let videoId = "dQw4w9WgXcQ"; 
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else {
      videoId = urlObj.searchParams.get("v") || videoId;
    }
  } catch(e) {}

  return {
    id: videoId,
    title: "Mastering AI in 2025: From Zero to Hero",
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    channelTitle: "FutureTech Daily",
    duration: "18:42"
  };
};

export const publishToYouTube = async (clipId: string): Promise<{ success: boolean, url: string }> => {
  await new Promise(r => setTimeout(r, 3000));
  const randomId = Math.random().toString(36).substring(7);
  return { 
    success: true, 
    url: `https://youtube.com/shorts/${randomId}` 
  };
};

export const scheduleToYouTube = async (clipId: string, scheduledTime: string): Promise<{ success: boolean }> => {
  await new Promise(r => setTimeout(r, 1500));
  return { success: true };
};
