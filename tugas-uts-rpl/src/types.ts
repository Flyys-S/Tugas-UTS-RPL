// =============================================
// SHARED TYPES — Mitra Maju Sejati
// =============================================

export interface MeasurementData {
  id: string;
  category: string;
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
  technicianCodeBranch: string;
  reportNumber: string;
  errorCode: string;
  failureCause: string;
  placeOfFailure: string;
  operationMode: string;
  setTemp: string;
  fanSpeed: string;
  statusOperation: string;
  installationDate: string;
  deliveryDate: string;
  endDate: string;
  diagnosis: string;
  checkingResult: string;
  sparePartDamage: string;
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
