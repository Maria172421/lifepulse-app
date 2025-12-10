import { Battery, Wifi, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DeviceStatusProps {
  lastUpdated?: Date;
}

export const DeviceStatus = ({ lastUpdated }: DeviceStatusProps) => {
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [batteryLevel] = useState(() => Math.floor(Math.random() * 20) + 80); // 80-100%

  useEffect(() => {
    if (!lastUpdated) return;

    const updateSeconds = () => {
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setSecondsAgo(diff);
    };

    updateSeconds();
    const interval = setInterval(updateSeconds, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-success';
    if (batteryLevel > 20) return 'text-warning';
    return 'text-danger';
  };

  const formatTimeAgo = () => {
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    return `${Math.floor(secondsAgo / 3600)}h ago`;
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Last Synced */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Synced: {lastUpdated ? formatTimeAgo() : 'Never'}</span>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-1.5 text-success">
        <Wifi className="h-3.5 w-3.5" />
        <span>Connected</span>
      </div>

      {/* Battery */}
      <div className={`flex items-center gap-1.5 ${getBatteryColor()}`}>
        <Battery className="h-3.5 w-3.5" />
        <span>{batteryLevel}%</span>
      </div>
    </div>
  );
};
