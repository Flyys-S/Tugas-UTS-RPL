// =============================================
// STORAGE SERVICE — Data Abstraction Layer
// =============================================
// Saat ini menggunakan localStorage.
// Nanti tinggal ganti implementasi di bawah ini
// dengan Supabase/API calls tanpa mengubah App.tsx.
// =============================================

import type { SavedReport, Customer } from './types';

const STORAGE_KEY = 'mms-reports';
const CUSTOMER_KEY = 'mms-customers';

// ---- HELPERS ----
function readAll(): SavedReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(reports: SavedReport[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

// =============================================
// PUBLIC API — ganti isi fungsi ini untuk database
// =============================================

/** Ambil semua laporan, terbaru di atas */
export function getAllReports(): SavedReport[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Simpan laporan baru */
export function saveReport(report: SavedReport): void {
  const all = readAll();
  all.push(report);
  writeAll(all);
}

/** Hapus laporan berdasarkan ID */
export function deleteReport(id: string): void {
  const filtered = readAll().filter(r => r.id !== id);
  writeAll(filtered);
}

/** Ambil satu laporan berdasarkan ID */
export function getReportById(id: string): SavedReport | undefined {
  return readAll().find(r => r.id === id);
}

/** Hitung total laporan */
export function getReportCount(): number {
  return readAll().length;
}

// =============================================
// CUSTOMER API
// =============================================

function readCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
}

export function getAllCustomers(): Customer[] {
  return readCustomers().sort((a, b) => a.name.localeCompare(b.name));
}

export function saveCustomer(customer: Customer): void {
  const all = readCustomers();
  all.push(customer);
  writeCustomers(all);
}

export function updateCustomer(customer: Customer): void {
  const all = readCustomers().map(c => c.id === customer.id ? customer : c);
  writeCustomers(all);
}

export function deleteCustomer(id: string): void {
  writeCustomers(readCustomers().filter(c => c.id !== id));
}

/** Auto-save customer dari form jika belum ada */
export function ensureCustomer(name: string, address: string): void {
  if (!name.trim()) return;
  const all = readCustomers();
  const exists = all.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
  if (!exists) {
    all.push({ id: Date.now().toString(), name: name.trim(), address: address.trim(), phone: '', createdAt: new Date().toISOString() });
    writeCustomers(all);
  }
}
