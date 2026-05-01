// =============================================
// SHARED TYPES — Mitra Maju Sejati
// =============================================

export interface MeasurementData {
  id: string;
  parameter: string;
  unit: string;
  reference: string;
  before: string;
  after: string;
}

export interface FormData {
  indoorModel: string;
  indoorSerial: string;
  outdoorModel: string;
  outdoorSerial: string;
  customerName: string;
  address: string;
  technicianName: string;
  reportNumber: string;
  errorCode: string;
  failureCause: string;
  operationMode: string;
  setTemp: string;
  diagnosis: string;
  checkingResult: string;
  countermeasure: string;
  reportDate: string;
}

export interface SavedReport {
  id: string;
  formData: FormData;
  measurements: MeasurementData[];
  createdAt: string; // ISO date string
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
}

export type Page = 'service-report' | 'riwayat' | 'customer';

export type FilterPeriod = 'all' | 'week' | 'month' | 'year';
