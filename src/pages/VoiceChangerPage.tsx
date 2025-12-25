import { useState } from 'react';
import { FileUpload } from '../components/features/FileUpload';
import { VoiceSelector } from '../components/features/VoiceSelector';
import { AudioPlayer } from '../components/features/AudioPlayer';
import { ProcessingStatus } from '../components/features/ProcessingStatus';
import { Header } from '../components/layout/Header';
import { VoiceType } from '../types/voice';
import { convertToWav, applyVoiceEffect } from '@/components/features/VoiceTransformation';

export const VoiceChangerPage = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceType>('robot');
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setAudioFile(file);
    setProcessedAudioUrl(null);
  };

  const handleProcess = async () => {
    if (!audioFile) return;

    setIsProcessing(true);
    setProcessingStep('Processing...');

    try {
      // TODO: Step 1 - Convert to WAV using FFmpeg WebAssembly
      const wavBlob = await convertToWav(audioFile);
      
      setProcessingStep('Applying voice effects...');
      
      // TODO: Step 2 - Apply voice transformation
      // const processedBlob = await applyVoiceEffect(wavBlob, selectedVoice);
      
      setProcessingStep('Finalizing...');
      
      // TODO: Step 3 - Create URL for playback
      // const url = URL.createObjectURL(processedBlob);
      // setProcessedAudioUrl(url);
      
      // Placeholder: For now, just use the original file
      const url = URL.createObjectURL(audioFile);
      setProcessedAudioUrl(url);
      
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
              Voice Changer
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform your audio with professional voice effects. Upload, process, and download - all in your browser.
            </p>
          </div>

          <div className="space-y-6">
            {/* File Upload */}
            <FileUpload onFileSelect={handleFileSelect} selectedFile={audioFile} />

            {/* Voice Type Selection */}
            {audioFile && (
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceSelect={setSelectedVoice}
                onProcess={handleProcess}
                disabled={isProcessing}
              />
            )}

            {/* Processing Status */}
            {isProcessing && (
              <ProcessingStatus step={processingStep} />
            )}

            {/* Audio Player */}
            {processedAudioUrl && !isProcessing && (
              <AudioPlayer
                audioUrl={processedAudioUrl}
                fileName={audioFile?.name || 'processed-audio'}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
