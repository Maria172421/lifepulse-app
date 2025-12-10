import { Settings as SettingsIcon, User, Bell, Shield, LogOut, Camera, Battery, Wifi } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    alerts: true,
    dailySummary: true,
    weeklyReport: false,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserInitials = () => {
    const email = user?.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={profileImage || undefined} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div>
                <p className="font-medium">Profile Picture</p>
                <p className="text-sm text-muted-foreground">
                  Click the avatar to upload a new photo
                </p>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Health Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified for abnormal readings
                </p>
              </div>
              <Switch
                checked={notifications.alerts}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, alerts: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive a daily health summary
                </p>
              </div>
              <Switch
                checked={notifications.dailySummary}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, dailySummary: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Report</p>
                <p className="text-sm text-muted-foreground">
                  Get a comprehensive weekly health report
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, weeklyReport: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Device Section */}
        <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Device</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">LifePulse SOS Health Band</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-success">
                    <Wifi className="h-3.5 w-3.5" />
                    Connected
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-success">
                    <Battery className="h-3.5 w-3.5" />
                    92%
                  </span>
                </div>
              </div>
              <div className="pulse-dot" />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Your health band is simulated in this demo. In production, this would 
              connect to the actual ESP32 device via Bluetooth or WiFi.
            </p>
          </div>
        </div>

        {/* Logout */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Button 
            variant="destructive" 
            onClick={signOut}
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
