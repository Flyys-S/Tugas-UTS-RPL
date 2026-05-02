// =============================================
// STORAGE SERVICE — Supabase Backend
// =============================================
// Semua operasi data sekarang terhubung ke Supabase.
// Fungsi-fungsi async mengembalikan Promise.
// =============================================

import { supabase } from './supabaseClient';
import type { SavedReport, Customer, MeasurementData, FormData } from './types';

// =============================================
// REPORTS API
// =============================================

/** Ambil semua laporan, terbaru di atas */
export async function getAllReports(): Promise<SavedReport[]> {
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !reports) return [];

  // Fetch measurements for each report
  const result: SavedReport[] = [];
  for (const r of reports) {
    const { data: meas } = await supabase
      .from('measurements')
      .select('*')
      .eq('report_id', r.id);

    result.push({
      id: String(r.id),
      formData: {
        indoorModel: r.indoor_model || '',
        indoorSerial: r.indoor_serial || '',
        outdoorModel: r.outdoor_model || '',
        outdoorSerial: r.outdoor_serial || '',
        customerName: r.customer_name || '',
        address: r.address || '',
        technicianName: r.technician_name || '',
        technicianCodeBranch: r.technician_code_branch || '',
        reportNumber: r.report_number || '',
        errorCode: r.error_code || '',
        failureCause: r.failure_cause || '',
        placeOfFailure: r.place_of_failure || '',
        operationMode: r.operation_mode || '',
        setTemp: r.set_temp || '',
        fanSpeed: r.fan_speed || '',
        statusOperation: r.status_operation || '',
        installationDate: r.installation_date || '',
        deliveryDate: r.delivery_date || '',
        endDate: r.end_date || '',
        diagnosis: r.diagnosis || '',
        checkingResult: r.checking_result || '',
        sparePartDamage: r.spare_part_damage || '',
        countermeasure: r.countermeasure || '',
        reportDate: r.report_date || '',
      },
      measurements: (meas || []).map((m: any) => ({
        id: String(m.id),
        category: m.category || '',
        parameter: m.parameter || '',
        unit: m.unit || '',
        reference: m.reference || '',
        before: m.before_value || '',
        after: m.after_value || '',
      })),
      createdAt: r.created_at,
    });
  }

  return result;
}

/** Simpan laporan baru */
export async function saveReport(report: SavedReport): Promise<void> {
  const fd = report.formData;

  const { data: inserted, error } = await supabase
    .from('reports')
    .insert({
      indoor_model: fd.indoorModel,
      indoor_serial: fd.indoorSerial,
      outdoor_model: fd.outdoorModel,
      outdoor_serial: fd.outdoorSerial,
      customer_name: fd.customerName,
      address: fd.address,
      technician_name: fd.technicianName,
      technician_code_branch: fd.technicianCodeBranch,
      report_number: fd.reportNumber,
      error_code: fd.errorCode,
      failure_cause: fd.failureCause,
      place_of_failure: fd.placeOfFailure,
      operation_mode: fd.operationMode,
      set_temp: fd.setTemp,
      fan_speed: fd.fanSpeed,
      status_operation: fd.statusOperation,
      installation_date: fd.installationDate,
      delivery_date: fd.deliveryDate,
      end_date: fd.endDate,
      diagnosis: fd.diagnosis,
      checking_result: fd.checkingResult,
      spare_part_damage: fd.sparePartDamage,
      countermeasure: fd.countermeasure,
      report_date: fd.reportDate,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    console.error('Error saving report:', error);
    return;
  }

  // Save measurements
  if (report.measurements.length > 0) {
    const rows = report.measurements.map(m => ({
      report_id: inserted.id,
      category: m.category,
      parameter: m.parameter,
      unit: m.unit,
      reference: m.reference,
      before_value: m.before,
      after_value: m.after,
    }));

    const { error: mError } = await supabase.from('measurements').insert(rows);
    if (mError) console.error('Error saving measurements:', mError);
  }
}

/** Hapus laporan berdasarkan ID (cascade deletes measurements) */
export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', Number(id));
  if (error) console.error('Error deleting report:', error);
}

/** Ambil satu laporan berdasarkan ID */
export async function getReportById(id: string): Promise<SavedReport | undefined> {
  const all = await getAllReports();
  return all.find(r => r.id === id);
}

/** Hitung total laporan */
export async function getReportCount(): Promise<number> {
  const { count } = await supabase.from('reports').select('*', { count: 'exact', head: true });
  return count || 0;
}

// =============================================
// CUSTOMER API
// =============================================

export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error || !data) return [];

  return data.map((c: any) => ({
    id: String(c.id),
    name: c.name || '',
    address: c.address || '',
    phone: c.phone || '',
    createdAt: c.created_at,
  }));
}

export async function saveCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase.from('customers').insert({
    name: customer.name,
    address: customer.address,
    phone: customer.phone,
  });
  if (error) console.error('Error saving customer:', error);
}

export async function updateCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .update({ name: customer.name, address: customer.address, phone: customer.phone })
    .eq('id', Number(customer.id));
  if (error) console.error('Error updating customer:', error);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', Number(id));
  if (error) console.error('Error deleting customer:', error);
}

/** Auto-save customer dari form jika belum ada */
export async function ensureCustomer(name: string, address: string): Promise<void> {
  if (!name.trim()) return;
  const { data } = await supabase
    .from('customers')
    .select('id')
    .ilike('name', name.trim())
    .limit(1);

  if (!data || data.length === 0) {
    await supabase.from('customers').insert({ name: name.trim(), address: address.trim(), phone: '' });
  }
}
