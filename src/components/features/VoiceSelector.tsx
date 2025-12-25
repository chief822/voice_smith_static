import { Bot, Venus, Radio } from 'lucide-react';
import { Button } from '../ui/button';
import { VoiceType } from '../../types/voice';
import { LucideIcon } from 'lucide-react';

interface VoiceOption {
  type: VoiceType;
  label: string;
  description: string;
  icon: LucideIcon;
}

const voiceOptions: VoiceOption[] = [
  {
    type: 'robot',
    label: 'Robot',
    description: 'Mechanical voice effect',
    icon: Bot,
  },
  {
    type: 'female',
    label: 'Female',
    description: 'Feminine voice effect',
    icon: Venus,
  },
  {
    type: 'old-radio',
    label: 'Old Radio',
    description: 'Old low quality radio voice effect',
    icon: Radio
  }
];

interface VoiceSelectorProps {
  selectedVoice: VoiceType;
  onVoiceSelect: (voice: VoiceType) => void;
  onProcess: () => void;
  disabled?: boolean;
}

export const VoiceSelector = ({
  selectedVoice,
  onVoiceSelect,
  onProcess,
  disabled,
}: VoiceSelectorProps) => {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-2xl font-semibold mb-6">Select Voice Effect</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {voiceOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.type}
              onClick={() => onVoiceSelect(option.type)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                selectedVoice === option.type
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={`p-3 rounded-lg ${
                    selectedVoice === option.type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={onProcess}
        disabled={disabled}
        className="w-full gradient-primary text-white font-semibold py-6 text-lg rounded-xl hover:opacity-90 transition-opacity"
        size="lg"
      >
        {disabled ? 'Processing...' : 'Transform Voice'}
      </Button>
    </div>
  );
};
