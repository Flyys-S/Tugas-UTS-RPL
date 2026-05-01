import { useState } from 'react';
import { Eye, Download, Trash2, Search, X } from 'lucide-react';
import type { SavedReport, FilterPeriod } from '../types';
import { deleteReport } from '../storage';

interface Props {
  reports: SavedReport[];
  onRefresh: () => void;
  onViewDetail: (report: SavedReport) => void;
}

function getStartOfWeek(): Date {
  const d = new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function filterReports(reports: SavedReport[], period: FilterPeriod, search: string): SavedReport[] {
  let filtered = reports;
  const now = new Date();
  if (period === 'week') {
    const start = getStartOfWeek();
    filtered = filtered.filter(r => new Date(r.createdAt) >= start);
  } else if (period === 'month') {
    filtered = filtered.filter(r => { const d = new Date(r.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  } else if (period === 'year') {
    filtered = filtered.filter(r => new Date(r.createdAt).getFullYear() === now.getFullYear());
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.formData.customerName.toLowerCase().includes(q) ||
      r.formData.reportNumber.toLowerCase().includes(q) ||
      r.formData.technicianName.toLowerCase().includes(q)
    );
  }
  return filtered;
}

function getPeriodLabel(period: FilterPeriod): string {
  if (period === 'week') return 'Minggu Ini';
  if (period === 'month') return 'Bulan Ini';
  if (period === 'year') return 'Tahun Ini';
  return 'Semua Waktu';
}

export default function Riwayat({ reports, onRefresh, onViewDetail }: Props) {
  const [period, setPeriod] = useState<FilterPeriod>('all');
  const [search, setSearch] = useState('');

  const filtered = filterReports(reports, period, search);

  const weekCount = filterReports(reports, 'week', '').length;
  const monthCount = filterReports(reports, 'month', '').length;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus laporan ini dari riwayat?')) {
      deleteReport(id);
      onRefresh();
    }
  };

  const handlePrintRekap = () => {
    // Build rekap HTML and print
    const rekapHTML = `
      <div style="font-family:'Outfit',sans-serif;padding:40px;color:#1a1a1a;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #588157;padding-bottom:16px;margin-bottom:24px;">
          <div><div style="font-size:22px;font-weight:800;color:#3a5a40;">Mitra Maju Sejati</div><div style="font-size:12px;color:#888;">Rekap Laporan Service</div></div>
          <div style="background:#588157;color:white;font-size:20px;font-weight:800;padding:8px 16px;border-radius:10px;">MMS</div>
        </div>
        <div style="text-align:center;font-size:16px;font-weight:700;margin-bottom:20px;">REKAP LAPORAN — ${getPeriodLabel(period).toUpperCase()}</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr style="background:#3a5a40;color:white;">
            <th style="padding:8px 10px;text-align:left;">No</th>
            <th style="padding:8px 10px;text-align:left;">Tanggal</th>
            <th style="padding:8px 10px;text-align:left;">No Laporan</th>
            <th style="padding:8px 10px;text-align:left;">Customer</th>
            <th style="padding:8px 10px;text-align:left;">Unit</th>
            <th style="padding:8px 10px;text-align:left;">Teknisi</th>
            <th style="padding:8px 10px;text-align:left;">Error</th>
          </tr></thead>
          <tbody>${filtered.map((r, i) => `
            <tr style="border-bottom:1px solid #dde5da;${i % 2 === 0 ? 'background:#f4f7f2;' : ''}">
              <td style="padding:7px 10px;">${i + 1}</td>
              <td style="padding:7px 10px;">${new Date(r.createdAt).toLocaleDateString('id-ID')}</td>
              <td style="padding:7px 10px;">${r.formData.reportNumber}</td>
              <td style="padding:7px 10px;">${r.formData.customerName}</td>
              <td style="padding:7px 10px;">${r.formData.indoorModel || '-'}</td>
              <td style="padding:7px 10px;">${r.formData.technicianName || '-'}</td>
              <td style="padding:7px 10px;">${r.formData.errorCode || '-'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:24px;padding-top:12px;border-top:1.5px solid #dde5da;font-size:11px;color:#888;display:flex;justify-content:space-between;">
          <span>Total: ${filtered.length} laporan</span>
          <span>Dicetak: ${new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>`;

    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<html><head><title>Rekap Laporan MMS</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet"></head><body>${rekapHTML}</body></html>`);
      w.document.close();
      setTimeout(() => { w.print(); }, 500);
    }
  };

  const pillCls = (p: FilterPeriod) =>
    `filter-pill ${period === p
      ? 'bg-sage-500 text-white active'
      : 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 border-sage-300 dark:border-sage-700 hover:bg-sage-200 dark:hover:bg-sage-700'}`;

  return (
    <section className="form-section">
      {/* Filter & Search Card */}
      <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="filter-bar">
            <button className={pillCls('all')} onClick={() => setPeriod('all')}>Semua</button>
            <button className={pillCls('week')} onClick={() => setPeriod('week')}>Minggu Ini</button>
            <button className={pillCls('month')} onClick={() => setPeriod('month')}>Bulan Ini</button>
            <button className={pillCls('year')} onClick={() => setPeriod('year')}>Tahun Ini</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari customer / no laporan..." className="pl-9 pr-8 py-2 text-sm rounded-lg bg-sage-50 dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500 outline-none w-64" />
              {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"><X size={14} /></button>}
            </div>
            {filtered.length > 0 && (
              <button onClick={handlePrintRekap} className="btn-download flex items-center gap-2 text-sm !py-2 !px-4">
                <Download size={15} /> Rekap PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
          <div className="stat-icon bg-sage-50 dark:bg-sage-800">📊</div>
          <div><div className="stat-value text-sage-900 dark:text-white">{reports.length}</div><div className="stat-label">Total Laporan</div></div>
        </div>
        <div className="stat-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
          <div className="stat-icon bg-sage-50 dark:bg-sage-800">📅</div>
          <div><div className="stat-value text-sage-900 dark:text-white">{weekCount}</div><div className="stat-label">Minggu Ini</div></div>
        </div>
        <div className="stat-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
          <div className="stat-icon bg-sage-50 dark:bg-sage-800">📆</div>
          <div><div className="stat-value text-sage-900 dark:text-white">{monthCount}</div><div className="stat-label">Bulan Ini</div></div>
        </div>
      </div>

      {/* Table */}
      <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800 !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="history-table">
            <thead>
              <tr className="bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200">
                <th>No</th><th>Tanggal</th><th>No Laporan</th><th>Customer</th><th>Unit</th><th>Teknisi</th><th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="history-empty">
                    <div className="history-empty-icon">📭</div>
                    <div className="font-semibold">Belum ada laporan</div>
                    <div className="text-sm mt-1">Buat service report untuk mulai menyimpan riwayat</div>
                  </div>
                </td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id} onClick={() => onViewDetail(r)} className="border-b border-sage-200 dark:border-sage-800/50 hover:bg-sage-50 dark:hover:bg-sage-800/50">
                  <td className="font-mono text-sage-500 text-sm">{i + 1}</td>
                  <td className="font-mono text-sm">{new Date(r.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="font-semibold">{r.formData.reportNumber}</td>
                  <td>{r.formData.customerName}</td>
                  <td className="text-sm text-sage-600 dark:text-sage-400">{r.formData.indoorModel || r.formData.outdoorModel || '-'}</td>
                  <td className="text-sm">{r.formData.technicianName || '-'}</td>
                  <td className="text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onViewDetail(r)} className="action-icon-btn text-sage-500 hover:text-sage-700 hover:bg-sage-100 dark:hover:bg-sage-800" title="Lihat"><Eye size={16} /></button>
                      <button onClick={(e) => handleDelete(r.id, e)} className="action-icon-btn text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" title="Hapus"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 text-xs text-sage-500 border-t border-sage-200 dark:border-sage-800">
            Menampilkan {filtered.length} dari {reports.length} laporan ({getPeriodLabel(period)})
          </div>
        )}
      </div>
    </section>
  );
}
