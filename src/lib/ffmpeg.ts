import { FFmpeg } from "@ffmpeg/ffmpeg";

/**
 * Singleton FFmpeg instance
 */
let ffmpeg: FFmpeg | null = null;
let loadProgress = 0;
let isLoaded = false;

// Progress listeners
const progressListeners: Set<(progress: number) => void> = new Set();

export function subscribeToProgress(callback: (progress: number) => void) {
  progressListeners.add(callback);
  // Immediately call with current progress
  callback(loadProgress);
  
  return () => {
    progressListeners.delete(callback);
  };
}

function notifyProgress(progress: number) {
  loadProgress = progress;
  progressListeners.forEach(callback => callback(progress));
}

export default async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    
    ffmpeg.on('log', ({ message }) => {
      console.log('[FFmpeg]', message);
    });

    // Simulate progress during load
    const progressInterval = setInterval(() => {
      if (loadProgress < 90) {
        loadProgress += Math.random() * 15;
        if (loadProgress > 90) loadProgress = 90;
        notifyProgress(loadProgress);
      }
    }, 100);

    try {
      await ffmpeg.load(); // no CDN, uses local WASM
      clearInterval(progressInterval);
      loadProgress = 100;
      isLoaded = true;
      notifyProgress(100);
      console.log("FFmpeg loaded successfully");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("FFmpeg loading failed:", error);
      throw error;
    }
  }
  
  return ffmpeg;
}

export function isFFmpegLoaded(): boolean {
  return isLoaded;
}

// Automatically start downloading ffmpeg on module load
getFFmpeg();
