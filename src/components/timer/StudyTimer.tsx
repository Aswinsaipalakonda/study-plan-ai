import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StudyTimerProps {
  subject?: string;
  topic?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  onClose?: () => void;
  initialDuration?: number;
}

const presets = [
  { label: '25 min', value: 25 * 60, name: 'Pomodoro' },
  { label: '45 min', value: 45 * 60, name: 'Extended' },
  { label: '90 min', value: 90 * 60, name: 'Deep Work' },
];

export function StudyTimer({
  subject = 'Study Session',
  topic = 'Focus Time',
  onComplete,
  onSkip,
  onClose,
  initialDuration = 25 * 60,
}: StudyTimerProps) {
  const [duration, setDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const progress = ((duration - timeLeft) / duration) * 100;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotification = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2GjY2NkIuHg3x1b2xqZ2ZlaGpsbW9wcnR1d3p8f4GDhoiKjI6QkpOTk5OSkY+NioeEgX57eHZ0c3JxcXFycnN0dXd4ent9f4GDhYeJi42Oj5CRkZKSkpGQj42LiYaEgX98enl3dnV0dHR0dXV2d3l6e31/gYOFh4mLjY6QkZKSk5OTkpGQjo2Lh4WCgH17enl3dnV1dXV1dnd4eXt8foGDhYeJi42PkJGSk5OTk5KRkI6MioiGg4B+fHp4d3Z1dXV1dnd4eXt9f4GDhYeJi42PkJKSk5OTkpKRj42MioeFgn9+fHp4d3Z2dXZ2dnh5e3x+gIKEhomLjY+QkZKTk5OTkpGQjoyKiIWCgH59e3l4d3Z2dnd3eHl7fH6AgoSGiYuNj5CRkpOTk5OSko+OjYqIhYOAfn18enl4d3d3eHl6e3x+gIKEhomLjY+QkZKTk5OTkpGQjoyKiIaDgH59e3p5eHh4eHl6e3x+gIKEhomLjY+QkZKTk5OTkpGQjoyKiIaDgYB+fHt5');
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playNotification();
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(duration);
      } else {
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 min break
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration, isBreak, playNotification]);

  const handlePresetClick = (value: number) => {
    setDuration(value);
    setTimeLeft(value);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{isBreak ? 'Break Time' : subject}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isBreak ? 'Take a short break' : topic}
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Timer Circle */}
          <div className="relative flex items-center justify-center">
            <svg width="320" height="320" className="transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
              />
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke={isBreak ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-6xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
              <Badge variant={isBreak ? 'secondary' : 'info'} className="mt-2">
                {isBreak ? 'Break' : 'Focus'}
              </Badge>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex justify-center gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant={duration === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePresetClick(preset.value)}
                disabled={isRunning}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-12 w-12"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button
              size="xl"
              className={cn(
                'h-16 w-16 rounded-full',
                isRunning && 'bg-warning hover:bg-warning/90'
              )}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7 ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onSkip}
              className="h-12 w-12"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onSkip}
            >
              Skip Session
            </Button>
            <Button
              variant="success"
              className="flex-1 gap-2"
              onClick={onComplete}
            >
              <CheckCircle className="h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
