import { Heart, Droplets, Activity, Shield, Zap } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VitalCard } from '@/components/dashboard/VitalCard';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { SOSButton } from '@/components/dashboard/SOSButton';
import { DeviceStatus } from '@/components/dashboard/DeviceStatus';
import { Button } from '@/components/ui/button';
import { useVitals } from '@/hooks/useVitals';
import { PpgStatus, FallStatus } from '@/types/health';

const SHOW_DEMO_MODE = import.meta.env.VITE_SHOW_DEMO_MODE !== 'false';

const getPpgLabel = (status: PpgStatus): string => {
  const labels: Record<PpgStatus, string> = {
    normal: 'Normal',
    bradycardia: 'Bradycardia',
    tachycardia: 'Tachycardia',
    arrhythmia: 'Arrhythmia',
  };
  return labels[status];
};

const getFallLabel = (status: FallStatus): string => {
  return status === 'safe' ? 'Safe' : 'Fall Detected';
};

const getHeartRateStatus = (hr: number): 'normal' | 'warning' | 'danger' => {
  if (hr < 50 || hr > 120) return 'danger';
  if (hr < 60 || hr > 100) return 'warning';
  return 'normal';
};

const getHeartRateLabel = (hr: number): string => {
  const status = getHeartRateStatus(hr);
  if (status === 'normal') return 'Normal';
  if (status === 'warning') return 'Elevated';
  return 'Critical';
};

const getSpO2Status = (spo2: number): 'normal' | 'warning' | 'danger' => {
  if (spo2 < 90) return 'danger';
  if (spo2 < 95) return 'warning';
  return 'normal';
};

const getSpO2Label = (spo2: number): string => {
  const status = getSpO2Status(spo2);
  if (status === 'normal') return 'Healthy';
  if (status === 'warning') return 'Low';
  return 'Critical';
};

const getPpgStatusType = (status: PpgStatus): 'normal' | 'warning' | 'danger' => {
  if (status === 'normal') return 'normal';
  if (status === 'bradycardia') return 'warning';
  return 'danger';
};

const Dashboard = () => {
  const { latestVitals, loading, simulateVitals, triggerSOS } = useVitals();

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold">Health Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time vitals from LifePulse Health Band
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {SHOW_DEMO_MODE && (
              <Button 
                variant="outline" 
                onClick={simulateVitals}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Load Sample Data
              </Button>
            )}
            <SOSButton onTrigger={triggerSOS} />
          </div>
        </div>

        {/* Device Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="text-sm font-medium">LifePulse SOS Band</span>
          </div>
          <DeviceStatus lastUpdated={latestVitals?.lastUpdated} />
        </div>

        {/* Vitals Grid */}
        {!loading && latestVitals ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <VitalCard
              title="Heart Rate"
              value={latestVitals.heartRate}
              unit="bpm"
              icon={<Heart className="h-6 w-6 text-heart-rate animate-heartbeat" />}
              status={getHeartRateStatus(latestVitals.heartRate)}
              statusLabel={getHeartRateLabel(latestVitals.heartRate)}
              colorClass="text-heart-rate"
              delay={100}
            />
            
            <VitalCard
              title="Blood Oxygen (SpO₂)"
              value={latestVitals.spo2}
              unit="%"
              icon={<Droplets className="h-6 w-6 text-spo2" />}
              status={getSpO2Status(latestVitals.spo2)}
              statusLabel={getSpO2Label(latestVitals.spo2)}
              colorClass="text-spo2"
              delay={200}
            />
            
            <StatusCard
              title="PPG Status"
              status={getPpgLabel(latestVitals.ppgStatus)}
              icon={<Activity className="h-6 w-6 text-ppg" />}
              isAlert={latestVitals.ppgStatus !== 'normal'}
              statusType={getPpgStatusType(latestVitals.ppgStatus)}
              statusLabel={latestVitals.ppgStatus === 'normal' ? 'Stable' : 'Irregular'}
              colorClass="text-ppg"
              delay={300}
            />
            
            <StatusCard
              title="Fall Detection"
              status={getFallLabel(latestVitals.fallStatus)}
              icon={<Shield className="h-6 w-6 text-fall" />}
              isAlert={latestVitals.fallStatus === 'fall_detected'}
              statusType={latestVitals.fallStatus === 'safe' ? 'normal' : 'danger'}
              statusLabel={latestVitals.fallStatus === 'safe' ? 'Safe' : 'Alert'}
              colorClass="text-fall"
              delay={400}
            />
          </div>
        ) : !loading ? (
          <div className="rounded-2xl bg-card p-12 text-center border border-border/50 animate-fade-in">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Vitals Data Yet</h3>
            <p className="text-muted-foreground mb-6">
              {SHOW_DEMO_MODE 
                ? 'Click "Load Sample Data" to generate test readings from the health band'
                : 'Waiting for data from your LifePulse Health Band'}
            </p>
            {SHOW_DEMO_MODE && (
              <Button onClick={simulateVitals} className="gap-2">
                <Zap className="h-4 w-4" />
                Generate First Reading
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="vitals-card h-36 animate-pulse bg-muted/50" />
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in opacity-0 animate-stagger-1" style={{ animationFillMode: 'forwards' }}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-heart-rate" />
              Heart Rate Guide
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="text-success">●</span> Normal: 60-100 bpm</li>
              <li><span className="text-warning">●</span> Warning: 50-60 or 100-120 bpm</li>
              <li><span className="text-danger">●</span> Critical: &lt;50 or &gt;120 bpm</li>
            </ul>
          </div>
          
          <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in opacity-0 animate-stagger-2" style={{ animationFillMode: 'forwards' }}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-spo2" />
              SpO₂ Guide
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="text-success">●</span> Normal: 95-100%</li>
              <li><span className="text-warning">●</span> Warning: 90-94%</li>
              <li><span className="text-danger">●</span> Critical: &lt;90%</li>
            </ul>
          </div>
          
          <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in opacity-0 animate-stagger-3" style={{ animationFillMode: 'forwards' }}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-ppg" />
              PPG Conditions
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="text-success">●</span> Normal: Regular rhythm</li>
              <li><span className="text-warning">●</span> Bradycardia: Slow heart rate</li>
              <li><span className="text-danger">●</span> Tachycardia/Arrhythmia: Irregular</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
