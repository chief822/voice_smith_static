import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
}

export const AudioPlayer = ({ audioUrl, fileName }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}-transformed.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Processed Audio</h2>
        <Button
          onClick={handleDownload}
          className="gap-2"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      <audio ref={audioRef} src={audioUrl} className="hidden" />

      {/* Waveform visualization placeholder */}
      <div className="flex items-center justify-center gap-1 h-32 mb-6 bg-secondary/30 rounded-xl px-8">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-primary to-accent rounded-full"
            style={{
              height: `${Math.random() * 60 + 20}%`,
              animation: isPlaying ? `waveform ${Math.random() * 0.5 + 0.8}s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          onClick={togglePlay}
          size="icon"
          className="w-16 h-16 rounded-full gradient-primary text-white hover:opacity-90"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          )}
        </Button>
      </div>
    </div>
  );
};
