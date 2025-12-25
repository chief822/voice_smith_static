import { Music } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold">Voice Changer</span>
        </div>
      </div>
    </header>
  );
};
