import { useCallback } from 'react';
import { Upload, FileAudio, X } from 'lucide-react';
import { Button } from '../ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('audio/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    onFileSelect(null as any);
  };

  return (
    <div className="glass rounded-2xl p-8">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer block">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Audio File</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your audio file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports MP3, WAV, M4A, OGG, and more
            </p>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <FileAudio className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{selectedFile.name}</h4>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="hover:bg-destructive/20 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
