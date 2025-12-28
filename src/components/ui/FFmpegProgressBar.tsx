import { useEffect, useState } from 'react';
import { Download, Check, Minimize2, Maximize2 } from 'lucide-react';
import { subscribeToProgress } from '@/lib/ffmpeg';
import { cn } from '@/lib/utils';

export function FFmpegProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToProgress((newProgress) => {
      setProgress(newProgress);
      
      if (newProgress >= 100 && !isComplete) {
        setIsComplete(true);
        // Auto-minimize after 2 seconds
        setTimeout(() => {
          setIsMinimized(true);
        }, 2000);
      }
    });

    return unsubscribe;
  }, [isComplete]);

  // Don't render if complete and minimized
  if (isComplete && isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative glass-card p-3 hover:scale-110 transition-all duration-300"
        >
          <div className="absolute inset-0 gradient-purple rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          <Check className="h-5 w-5 text-primary" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isMinimized ? "scale-0 opacity-0" : "scale-100 opacity-100 animate-slide-up"
      )}
    >
      <div className="glass-card p-4 w-80 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <div className="relative">
                <div className="absolute inset-0 gradient-purple rounded-full blur-md opacity-50" />
                <div className="relative bg-primary/10 p-2 rounded-full">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 gradient-purple rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative bg-primary/10 p-2 rounded-full">
                  <Download className="h-4 w-4 text-primary animate-pulse" />
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isComplete ? 'Assets Ready' : 'Loading assets'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isComplete ? 'Initialization complete' : 'Preparing video processor'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              {isComplete ? 'Complete' : 'Progress'}
            </span>
            <span className="text-primary font-bold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 gradient-purple-radial" />
            
            {/* Progress fill */}
            <div
              className={cn(
                "h-full gradient-purple transition-all duration-300 ease-out relative",
                !isComplete && "animate-progress-shimmer"
              )}
              style={{ 
                width: `${progress}%`,
                backgroundSize: '200% 100%',
              }}
            >
              {/* Shimmer overlay */}
              {!isComplete && (
                <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-progress-shimmer" />
              )}
            </div>
            
            {/* Glow effect */}
            {!isComplete && progress > 0 && (
              <div
                className="absolute top-0 h-full w-8 blur-sm gradient-purple opacity-50 transition-all duration-300"
                style={{ left: `${Math.max(0, progress - 8)}%` }}
              />
            )}
          </div>
        </div>

        {/* Status text */}
        {isComplete && (
          <div className="mt-3 text-xs text-center text-muted-foreground">
            Video processing is now available
          </div>
        )}
      </div>
    </div>
  );
}
