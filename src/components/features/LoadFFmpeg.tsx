import { FFmpeg } from "@ffmpeg/ffmpeg";

/**
 * Singleton FFmpeg instance
 */
let ffmpeg: FFmpeg | null = null;

export default async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    await ffmpeg.load(); // no CDN, uses local WASM
  }
  console.log("FFmpeg loaded successfully");
  return ffmpeg;
}

getFFmpeg(); // automatically start downloading ffmpeg on website visit