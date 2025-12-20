import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({ title, value, icon, subtitle, className, iconClassName }: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-xl',
            iconClassName || 'bg-primary/10 text-primary'
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
