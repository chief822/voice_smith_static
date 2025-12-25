export type VoiceType = 'robot' | 'female' | 'old-radio';

export interface AudioProcessingOptions {
  voiceType: VoiceType;
  inputFile: File;
}

export interface ProcessingResult {
  audioBlob: Blob;
  duration: number;
}
