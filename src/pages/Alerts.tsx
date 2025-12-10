import { Bell, Check, AlertTriangle, Heart, Droplets, Phone, Shield } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAlerts } from '@/hooks/useAlerts';
import { Alert, AlertType } from '@/types/health';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case 'fall':
      return <Shield className="h-5 w-5" />;
    case 'sos':
      return <Phone className="h-5 w-5" />;
    case 'abnormal_hr':
      return <Heart className="h-5 w-5" />;
    case 'abnormal_spo2':
      return <Droplets className="h-5 w-5" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const getAlertLabel = (type: AlertType): string => {
  const labels: Record<AlertType, string> = {
    fall: 'Fall Detected',
    sos: 'SOS Emergency',
    abnormal_hr: 'Abnormal Heart Rate',
    abnormal_spo2: 'Low Blood Oxygen',
  };
  return labels[type];
};

const AlertCard = ({ 
  alert, 
  onResolve 
}: { 
  alert: Alert; 
  onResolve: (id: string) => void;
}) => {
  const isActive = alert.status === 'active';
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className={cn(
            'rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-md animate-fade-in',
            isActive 
              ? 'bg-danger/5 border-danger/30 hover:border-danger/50' 
              : 'bg-card border-border/50 hover:border-border'
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                'rounded-xl p-3',
                isActive ? 'bg-danger/15 text-danger' : 'bg-muted text-muted-foreground'
              )}>
                {getAlertIcon(alert.alert_type)}
              </div>
              <div>
                <h3 className="font-semibold">{getAlertLabel(alert.alert_type)}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(alert.created_at), 'MMM d, yyyy h:mm a')}
                </p>
                {alert.details && (
                  <p className="text-sm mt-2 line-clamp-2">{alert.details}</p>
                )}
              </div>
            </div>
            
            <div className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
              isActive ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'
            )}>
              {isActive ? 'Active' : 'Resolved'}
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn(
              'rounded-lg p-2',
              isActive ? 'bg-danger/15 text-danger' : 'bg-muted text-muted-foreground'
            )}>
              {getAlertIcon(alert.alert_type)}
            </div>
            {getAlertLabel(alert.alert_type)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <DialogDescription className="text-base">
            {alert.details || 'No additional details available.'}
          </DialogDescription>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(alert.created_at), 'PPpp')}
              </p>
            </div>
            {alert.resolved_at && (
              <div>
                <p className="text-muted-foreground">Resolved</p>
                <p className="font-medium">
                  {format(new Date(alert.resolved_at), 'PPpp')}
                </p>
              </div>
            )}
            {alert.heart_rate && (
              <div>
                <p className="text-muted-foreground">Heart Rate</p>
                <p className="font-medium">{alert.heart_rate} bpm</p>
              </div>
            )}
            {alert.spo2 && (
              <div>
                <p className="text-muted-foreground">SpO₂</p>
                <p className="font-medium">{alert.spo2}%</p>
              </div>
            )}
          </div>
          
          {isActive && (
            <Button 
              onClick={() => onResolve(alert.id)}
              className="w-full gap-2"
              variant="success"
            >
              <Check className="h-4 w-4" />
              Mark as Resolved
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Alerts = () => {
  const { alerts, loading, resolveAlert, getActiveAlertsCount } = useAlerts();
  const activeCount = getActiveAlertsCount();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Alerts</h1>
            {activeCount > 0 && (
              <span className="rounded-full bg-danger px-3 py-1 text-sm font-medium text-danger-foreground">
                {activeCount} active
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            View and manage health alerts from your monitoring device
          </p>
        </div>

        {/* Alerts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={alert.id} style={{ animationDelay: `${index * 100}ms` }}>
                <AlertCard alert={alert} onResolve={resolveAlert} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card p-12 text-center border border-border/50 animate-fade-in">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Alerts</h3>
            <p className="text-muted-foreground">
              All vitals are within normal ranges. You'll be notified if any issues are detected.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Alerts;
