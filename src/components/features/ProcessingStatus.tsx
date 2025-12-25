import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  step: string;
}

export const ProcessingStatus = ({ step }: ProcessingStatusProps) => {
  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center relative">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Processing Audio</h3>
          <p className="text-muted-foreground">{step}</p>
        </div>
      </div>
    </div>
  );
};
