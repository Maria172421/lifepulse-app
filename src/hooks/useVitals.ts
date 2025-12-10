import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Vital, VitalsData, PpgStatus, FallStatus, AlertType } from '@/types/health';
import { toast } from '@/hooks/use-toast';

export const useVitals = () => {
  const { user } = useAuth();
  const [latestVitals, setLatestVitals] = useState<VitalsData | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestVitals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vitals')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching vitals:', error);
      return;
    }

    if (data) {
      setLatestVitals({
        heartRate: data.heart_rate,
        spo2: data.spo2,
        ppgStatus: data.ppg_status as PpgStatus,
        fallStatus: data.fall_status as FallStatus,
        lastUpdated: new Date(data.recorded_at),
      });
    }
    setLoading(false);
  };

  const fetchVitalsHistory = async (startDate?: Date, endDate?: Date) => {
    if (!user) return;

    let query = supabase
      .from('vitals')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: true });

    if (startDate) {
      query = query.gte('recorded_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('recorded_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching vitals history:', error);
      return;
    }

    setVitalsHistory((data || []) as Vital[]);
  };

  const addVital = async (vital: Omit<Vital, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vitals')
      .insert({
        user_id: user.id,
        heart_rate: vital.heart_rate,
        spo2: vital.spo2,
        ppg_status: vital.ppg_status,
        fall_status: vital.fall_status,
        recorded_at: vital.recorded_at,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding vital:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vital reading',
        variant: 'destructive',
      });
      return null;
    }

    // Check for abnormal readings and create alerts
    if (vital.heart_rate < 60 || vital.heart_rate > 100) {
      await createAlert('abnormal_hr', vital.heart_rate, vital.spo2);
    }
    if (vital.spo2 < 95) {
      await createAlert('abnormal_spo2', vital.heart_rate, vital.spo2);
    }
    if (vital.fall_status === 'fall_detected') {
      await createAlert('fall', vital.heart_rate, vital.spo2);
    }

    await fetchLatestVitals();
    return data;
  };

  const createAlert = async (alertType: AlertType, heartRate: number, spo2: number) => {
    if (!user) return;

    const details = getAlertDetails(alertType, heartRate, spo2);

    await supabase.from('alerts').insert({
      user_id: user.id,
      alert_type: alertType,
      heart_rate: heartRate,
      spo2: spo2,
      details: details,
    });

    toast({
      title: 'Alert Created',
      description: details,
      variant: 'destructive',
    });
  };

  const getAlertDetails = (alertType: AlertType, heartRate: number, spo2: number): string => {
    switch (alertType) {
      case 'abnormal_hr':
        return `Abnormal heart rate detected: ${heartRate} bpm`;
      case 'abnormal_spo2':
        return `Low oxygen level detected: ${spo2}%`;
      case 'fall':
        return 'Fall detected! Emergency contacts notified.';
      case 'sos':
        return 'SOS emergency triggered by user.';
      default:
        return 'Health alert detected.';
    }
  };

  const simulateVitals = async () => {
    const randomHR = Math.floor(Math.random() * 60) + 50; // 50-110 bpm
    const randomSpO2 = Math.floor(Math.random() * 10) + 92; // 92-101%
    
    const ppgOptions: PpgStatus[] = ['normal', 'normal', 'normal', 'bradycardia', 'tachycardia', 'arrhythmia'];
    const fallOptions: FallStatus[] = ['safe', 'safe', 'safe', 'safe', 'safe', 'fall_detected'];
    
    const randomPpg = ppgOptions[Math.floor(Math.random() * ppgOptions.length)];
    const randomFall = fallOptions[Math.floor(Math.random() * fallOptions.length)];

    await addVital({
      heart_rate: randomHR,
      spo2: Math.min(randomSpO2, 100),
      ppg_status: randomPpg,
      fall_status: randomFall,
      recorded_at: new Date().toISOString(),
    });

    toast({
      title: 'Simulation Complete',
      description: `HR: ${randomHR} bpm, SpO2: ${Math.min(randomSpO2, 100)}%`,
    });
  };

  const triggerSOS = async () => {
    if (!user) return;

    await supabase.from('alerts').insert({
      user_id: user.id,
      alert_type: 'sos',
      heart_rate: latestVitals?.heartRate || null,
      spo2: latestVitals?.spo2 || null,
      details: 'SOS emergency triggered by user. Emergency contacts have been notified.',
    });

    toast({
      title: 'SOS Alert Sent!',
      description: 'Emergency contacts have been notified.',
      variant: 'destructive',
    });
  };

  useEffect(() => {
    if (user) {
      fetchLatestVitals();
    }
  }, [user]);

  return {
    latestVitals,
    vitalsHistory,
    loading,
    fetchLatestVitals,
    fetchVitalsHistory,
    addVital,
    simulateVitals,
    triggerSOS,
  };
};
