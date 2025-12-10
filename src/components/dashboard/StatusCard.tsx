import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  status: string;
  icon: ReactNode;
  isAlert?: boolean;
  statusType?: 'normal' | 'warning' | 'danger';
  statusLabel?: string;
  colorClass: string;
  delay?: number;
}

export const StatusCard = ({ 
  title, 
  status, 
  icon, 
  isAlert = false,
  statusType = 'normal',
  statusLabel,
  colorClass,
  delay = 0,
}: StatusCardProps) => {
  const chipColors = {
    normal: 'status-chip-success',
    warning: 'status-chip-warning',
    danger: 'status-chip-danger',
  };

  return (
    <div 
      className={cn(
        'vitals-card border-2 animate-fade-in opacity-0',
        isAlert ? 'border-danger/30 bg-danger/5' : 'border-success/20 bg-success/5'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {statusLabel && (
              <span className={cn('status-chip', chipColors[statusType])}>
                {statusLabel}
              </span>
            )}
          </div>
          <div className={cn(
            'mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold',
            isAlert ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'
          )}>
            {isAlert ? (
              <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
            ) : (
              <span className="pulse-dot" />
            )}
            {status}
          </div>
        </div>
        <div className={cn('rounded-xl p-3', colorClass, 'bg-opacity-10')}>
          {icon}
        </div>
      </div>
    </div>
  );
};
