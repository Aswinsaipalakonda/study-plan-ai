import { Calendar, Clock, Target, MoreVertical, Archive, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StudyPlan } from '@/types';
import { subjectColors } from '@/data/mockData';

interface PlanCardProps {
  plan: StudyPlan;
}

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const },
  completed: { label: 'Completed', variant: 'muted' as const },
  archived: { label: 'Archived', variant: 'muted' as const },
};

export function PlanCard({ plan }: PlanCardProps) {
  const config = statusConfig[plan.status];
  const completedSessions = plan.sessions.filter(s => s.status === 'completed').length;
  const totalSessions = plan.sessions.length;

  return (
    <Card className="group hover:shadow-soft transition-all duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <h3 className="font-semibold text-lg leading-tight mt-2">{plan.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/plans/${plan.id}`} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5">
          {plan.subjects.map((subject) => (
            <Badge
              key={subject}
              className={subjectColors[subject] || 'bg-muted text-muted-foreground'}
            >
              {subject}
            </Badge>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {plan.deadline && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(plan.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {plan.weeklyHours}h/week
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {totalSessions} sessions
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedSessions}/{totalSessions} sessions</span>
          </div>
          <Progress value={plan.progress} className="h-2" />
        </div>

        {/* Action */}
        <Button asChild variant="outline" className="w-full">
          <Link to={`/plans/${plan.id}`}>View Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
