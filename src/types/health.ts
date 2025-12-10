export type PpgStatus = 'normal' | 'bradycardia' | 'tachycardia' | 'arrhythmia';
export type FallStatus = 'safe' | 'fall_detected';
export type AlertType = 'fall' | 'sos' | 'abnormal_hr' | 'abnormal_spo2';
export type AlertStatus = 'active' | 'resolved';

export interface Vital {
  id: string;
  user_id: string;
  heart_rate: number;
  spo2: number;
  ppg_status: PpgStatus;
  fall_status: FallStatus;
  recorded_at: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  alert_type: AlertType;
  status: AlertStatus;
  heart_rate: number | null;
  spo2: number | null;
  details: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone_number: string;
  notify_sms: boolean;
  notify_call: boolean;
  notify_app: boolean;
  created_at: string;
  updated_at: string;
}

export interface VitalsData {
  heartRate: number;
  spo2: number;
  ppgStatus: PpgStatus;
  fallStatus: FallStatus;
  lastUpdated: Date;
}
