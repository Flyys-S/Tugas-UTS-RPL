// =============================================
// STORAGE SERVICE — Data Abstraction Layer
// =============================================
// Saat ini menggunakan localStorage.
// Nanti tinggal ganti implementasi di bawah ini
// dengan Supabase/API calls tanpa mengubah App.tsx.
// =============================================

import type { SavedReport } from './types';

const STORAGE_KEY = 'mms-reports';

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
