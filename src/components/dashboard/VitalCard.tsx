import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  status?: 'normal' | 'warning' | 'danger';
  statusLabel?: string;
  colorClass: string;
  delay?: number;
}

export const VitalCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  status = 'normal',
  statusLabel,
  colorClass,
  delay = 0,
}: VitalCardProps) => {
  const statusColors = {
    normal: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    danger: 'border-danger/20 bg-danger/5',
  };

  const chipColors = {
    normal: 'status-chip-success',
    warning: 'status-chip-warning',
    danger: 'status-chip-danger',
  };

  return (
    <div 
      className={cn(
        'vitals-card border-2 animate-fade-in opacity-0',
        statusColors[status]
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {statusLabel && (
              <span className={cn('status-chip', chipColors[status])}>
                {statusLabel}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={cn('text-4xl font-bold', colorClass)}>{value}</span>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className={cn('rounded-xl p-3', colorClass, 'bg-opacity-10')}>
          {icon}
        </div>
      </div>
      
      {status !== 'normal' && (
        <div className={cn(
          'mt-4 rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5',
          status === 'warning' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
        )}>
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          {status === 'warning' ? 'Needs attention' : 'Critical'}
        </div>
      )}
    </div>
  );
};
