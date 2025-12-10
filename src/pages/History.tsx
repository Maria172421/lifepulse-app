import { useEffect, useState } from 'react';
import { History as HistoryIcon, Calendar, Heart, Droplets } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useVitals } from '@/hooks/useVitals';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateRange = 'today' | '7days' | 'custom';

const History = () => {
  const { vitalsHistory, fetchVitalsHistory } = useVitals();
  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [dateRange, customStartDate, customEndDate]);

  const loadData = () => {
    let startDate: Date;
    let endDate = endOfDay(new Date());

    switch (dateRange) {
      case 'today':
        startDate = startOfDay(new Date());
        break;
      case '7days':
        startDate = startOfDay(subDays(new Date(), 7));
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = startOfDay(customStartDate);
          endDate = endOfDay(customEndDate);
        } else {
          return;
        }
        break;
      default:
        startDate = startOfDay(subDays(new Date(), 7));
    }

    fetchVitalsHistory(startDate, endDate);
  };

  const chartData = vitalsHistory.map(vital => ({
    time: format(new Date(vital.recorded_at), 'MMM d, HH:mm'),
    heartRate: vital.heart_rate,
    spo2: vital.spo2,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Health History</h1>
            <p className="text-muted-foreground mt-1">
              View your vital signs over time
            </p>
          </div>
          
          {/* Date Range Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('today')}
            >
              Today
            </Button>
            <Button
              variant={dateRange === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('7days')}
            >
              Last 7 Days
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={dateRange === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Custom Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Start Date</p>
                    <CalendarComponent
                      mode="single"
                      selected={customStartDate}
                      onSelect={(date) => {
                        setCustomStartDate(date);
                        if (date && customEndDate) {
                          setDateRange('custom');
                        }
                      }}
                      disabled={(date) => date > new Date()}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">End Date</p>
                    <CalendarComponent
                      mode="single"
                      selected={customEndDate}
                      onSelect={(date) => {
                        setCustomEndDate(date);
                        if (customStartDate && date) {
                          setDateRange('custom');
                        }
                      }}
                      disabled={(date) => date > new Date() || (customStartDate && date < customStartDate)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Charts */}
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Heart Rate Chart */}
            <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-5 w-5 text-heart-rate" />
                <h3 className="text-lg font-semibold">Heart Rate</h3>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      domain={[40, 140]}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="hsl(350, 80%, 55%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(350, 80%, 55%)', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: 'hsl(350, 80%, 55%)' }}
                      name="Heart Rate (bpm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Reference Lines */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-success" />
                  <span className="text-muted-foreground">Normal: 60-100 bpm</span>
                </div>
              </div>
            </div>

            {/* SpO2 Chart */}
            <div className="rounded-2xl bg-card p-6 border border-border/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <Droplets className="h-5 w-5 text-spo2" />
                <h3 className="text-lg font-semibold">Blood Oxygen (SpO₂)</h3>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      domain={[85, 100]}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="spo2"
                      stroke="hsl(200, 85%, 50%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(200, 85%, 50%)', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: 'hsl(200, 85%, 50%)' }}
                      name="SpO₂ (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Reference Lines */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-success" />
                  <span className="text-muted-foreground">Normal: 95-100%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-card p-12 text-center border border-border/50 animate-fade-in">
            <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No History Data</h3>
            <p className="text-muted-foreground">
              Start recording vitals to see your health trends over time. 
              Use the "Simulate Data" button on the dashboard to generate test data.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default History;
