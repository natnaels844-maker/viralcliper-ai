
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ViralClip, YouTubeVideoMetadata, LocalizedVersion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to decode base64 to Uint8Array (required for raw PCM)
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to convert raw PCM to AudioBuffer
async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export const analyzeVideoForClips = async (video: YouTubeVideoMetadata): Promise<ViralClip[]> => {
  const prompt = `
    Act as a World-Class Social Media Growth Strategist and Video Editor. 
    Analyze this YouTube video:
    Title: ${video.title}
    
    Task: Identify 5 segments optimized for high retention on vertical platforms.
    
    For each segment, include:
    1. Precise timestamps (Start/End).
    2. A "Retainment Strategy" (the psychology behind why it works).
    3. 3-4 "Suggested Captions" (Text overlays for the viewer).
    4. 3 "Visual Hooks" (Instructions for the edit, e.g., "Zoom at 5s").
    
    Return the response as a JSON array.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            startTime: { type: Type.STRING },
            endTime: { type: Type.STRING },
            durationSeconds: { type: Type.NUMBER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            viralScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            platformTarget: { type: Type.STRING, enum: ['Shorts', 'TikTok', 'Reels', 'Universal'] },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCaptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  style: { type: Type.STRING, enum: ['impact', 'question', 'highlight'] }
                },
                required: ["text", "timing", "style"]
              }
            },
            visualHooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  action: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['zoom', 'cut', 'overlay', 'transition'] }
                },
                required: ["timestamp", "action", "type"]
              }
            }
          },
          required: ["id", "startTime", "endTime", "durationSeconds", "title", "viralScore", "reasoning", "tags", "suggestedCaptions", "platformTarget", "visualHooks"]
        }
      }
    }
  });

  try {
    const clips = JSON.parse(response.text || "[]");
    return clips.map((clip: any) => ({
      ...clip,
      status: 'ready' as const
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
};

export const globalizeClip = async (clip: ViralClip, targetLanguages: string[]): Promise<LocalizedVersion[]> => {
  const prompt = `Localize this viral video clip for: ${targetLanguages.join(', ')}. Title: ${clip.title}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "[]");
};

export const generatePreviewTTS = async (text: string, voiceName: string = 'Kore'): Promise<void> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this with a viral creator energy: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Synthesis failed:", error);
  }
};
