import { Play, Clock, CheckCircle, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudySession } from '@/types';
import { cn } from '@/lib/utils';
import { subjectColors } from '@/data/mockData';

interface SessionCardProps {
  session: StudySession;
  onStart?: () => void;
  compact?: boolean;
}

const statusConfig = {
  upcoming: { label: 'Upcoming', variant: 'info' as const, icon: Clock },
  'in-progress': { label: 'In Progress', variant: 'success' as const, icon: Pause },
  completed: { label: 'Completed', variant: 'muted' as const, icon: CheckCircle },
  skipped: { label: 'Skipped', variant: 'muted' as const, icon: null },
};

export function SessionCard({ session, onStart, compact = false }: SessionCardProps) {
  const config = statusConfig[session.status];
  const StatusIcon = config.icon;
  const subjectColor = subjectColors[session.subject] || 'bg-muted text-muted-foreground';

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{session.title}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{session.startTime}</span>
            <span>•</span>
            <span>{session.duration} min</span>
          </div>
        </div>
        <Badge className={subjectColor}>{session.subject}</Badge>
      </div>
    );
  }

  return (
    <Card className={cn(
      'transition-all duration-200',
      session.status === 'in-progress' && 'ring-2 ring-success shadow-glow'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={config.variant} className="gap-1">
                {StatusIcon && <StatusIcon className="h-3 w-3" />}
                {config.label}
              </Badge>
              <Badge className={subjectColor}>{session.subject}</Badge>
            </div>
            <h3 className="font-semibold mb-1">{session.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{session.topic}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.startTime}
              </span>
              <span>{session.duration} min</span>
              {session.technique && (
                <Badge variant="outline" className="text-xs">
                  {session.technique}
                </Badge>
              )}
            </div>
          </div>
          {session.status === 'upcoming' && (
            <Button onClick={onStart} size="sm" className="gap-2 shrink-0">
              <Play className="h-4 w-4" />
              Start
            </Button>
          )}
          {session.status === 'in-progress' && (
            <Button variant="success" size="sm" className="gap-2 shrink-0">
              <Pause className="h-4 w-4" />
              In Progress
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
