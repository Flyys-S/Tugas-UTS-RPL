import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Plus, Trash2, ArrowLeft, Download, FileText } from 'lucide-react';
import './index.css';
import type { MeasurementData, FormData, SavedReport, Page } from './types';
import { getAllReports, saveReport } from './storage';
import Riwayat from './components/Riwayat';
import ReportModal from './components/ReportModal';

const initialMeasurements: MeasurementData[] = [
  { id: '1', parameter: 'Voltage (R-S)', unit: 'V', reference: '380-410V', before: '-', after: '405 Volt' },
  { id: '2', parameter: 'Voltage (S-T)', unit: 'V', reference: '380-410V', before: '-', after: '402 Volt' },
  { id: '3', parameter: 'Voltage (R-T)', unit: 'V', reference: '380-410V', before: '-', after: '404 Volt' },
  { id: '4', parameter: 'Ampere Total', unit: 'A', reference: '-', before: '-', after: '27 Amp' },
  { id: '5', parameter: 'Ampere Comp', unit: 'A', reference: '-', before: '-', after: '32 Amp' },
  { id: '6', parameter: 'Pipa Discharge', unit: '°C', reference: '+20-25°C', before: '-', after: '83°C' },
  { id: '7', parameter: 'Pipa Hisap', unit: '°C', reference: '+2-8°C', before: '-', after: '12.1°C' },
  { id: '8', parameter: 'Low Pressure', unit: 'Mpa', reference: '0.5-1.1', before: '-', after: '1.00' },
  { id: '9', parameter: 'High Pressure', unit: 'Mpa', reference: '2.1-3.3', before: '-', after: '3.80' }
];

function App() {
  const [formData, setFormData] = useState<FormData>({
    indoorModel: '', indoorSerial: '', outdoorModel: '', outdoorSerial: '',
    customerName: '', address: '', technicianName: '', reportNumber: '',
    errorCode: '', failureCause: '46. KABEL ANTARA PCB TIDAK TERHUBUNG DENGAN BAIK',
    operationMode: 'Cool', setTemp: '', diagnosis: '', checkingResult: '',
    countermeasure: '', reportDate: new Date().toISOString().split('T')[0]
  });

  const [measurements, setMeasurements] = useState<MeasurementData[]>(initialMeasurements);
  const [showPreview, setShowPreview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formError, setFormError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Navigation & History
  const [currentPage, setCurrentPage] = useState<Page>('service-report');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null);
  const [toast, setToast] = useState('');

  const refreshReports = () => setSavedReports(getAllReports());
  useEffect(() => { refreshReports(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev, indoorModel: 'FXQ20BY14', outdoorModel: 'RXQ20BY14',
      outdoorSerial: 'E000580', customerName: 'BPK MT Haryono',
      address: 'South Jakarta Office', technicianName: 'Iwan Saputra',
      reportNumber: '00133772', errorCode: 'U7', setTemp: '17',
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleMeasurementChange = (id: string, field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMeasurementRow = () => {
    setMeasurements(prev => [...prev, { id: Date.now().toString(), parameter: '', unit: '', reference: '', before: '', after: '' }]);
  };

  const removeMeasurementRow = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const generateReport = () => {
    if (!formData.customerName.trim() || !formData.reportNumber.trim() || (!formData.indoorModel.trim() && !formData.outdoorModel.trim())) {
      setFormError('Pastikan Nama Customer, No Laporan, dan Model Unit terisi!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFormError('');
    // Auto-save ke storage
    const report: SavedReport = {
      id: Date.now().toString(),
      formData: { ...formData },
      measurements: [...measurements],
      createdAt: new Date().toISOString(),
    };
    saveReport(report);
    refreshReports();
    setToast('✅ Laporan tersimpan ke riwayat!');
    setTimeout(() => setToast(''), 3000);
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setShowPreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = currentPage === 'riwayat' ? 'Riwayat Laporan' : 'Service Report Generator';

  const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const inputCls = "form-input bg-sage-50 dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-800 text-sage-900 dark:text-sage-100 focus:border-sage-500";
  const textareaCls = `${inputCls} form-textarea`;

  return (
    <div className="min-h-screen bg-sage-100 dark:bg-sage-950 text-sage-900 dark:text-sage-50 transition-colors duration-300 print:bg-white">

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar print:hidden">
        <div className="sidebar-logo">
          <div className="logo-badge">MMS</div>
          <div className="logo-text">
            <span className="logo-main">Mitra Maju</span>
            <span className="logo-sub">Sejati</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          <button className={`nav-item ${currentPage === 'service-report' ? 'active' : ''}`} onClick={() => navigateTo('service-report')}><span className="nav-icon">📋</span><span>Service Report</span></button>
          <button className={`nav-item ${currentPage === 'riwayat' ? 'active' : ''}`} onClick={() => navigateTo('riwayat')}><span className="nav-icon">📁</span><span>Riwayat</span></button>
          <button className="nav-item"><span className="nav-icon">🔧</span><span>Unit</span></button>
          <button className="nav-item"><span className="nav-icon">👤</span><span>Customer</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-version">v2.0.0</div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <main className="main-area">

        {/* TOPBAR */}
        <header className="topbar bg-white dark:bg-sage-900 border-b-[1.5px] border-sage-300 dark:border-sage-800 print:hidden">
          <div>
            <h1 className="page-title text-sage-900 dark:text-white">
              {pageTitle} <span className="page-title-tag">MMS</span>
            </h1>
            <p className="page-subtitle text-sage-500">{currentPage === 'riwayat' ? 'Lihat dan kelola semua laporan servis' : 'Buat laporan servis AC profesional dalam hitungan detik'}</p>
          </div>
          <div className="topbar-right">
            <div className="date-badge bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-700 dark:text-sage-200">{todayStr}</div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-sage-200 dark:bg-sage-800 hover:bg-sage-300 dark:hover:bg-sage-700 text-sage-700 dark:text-sage-200 transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* ===== FORM SECTION ===== */}
        {currentPage === 'service-report' && !showPreview && (
          <section className="form-section">

            {formError && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                <span className="text-xl">⚠️</span> {formError}
              </div>
            )}

            {/* Card: Informasi Unit */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">🖥️</div>
                <div><div className="card-title text-sage-900 dark:text-white">Informasi Unit</div><div className="card-desc text-sage-500">Model dan serial number perangkat</div></div>
              </div>
              <div className="form-grid col-4">
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Model Indoor Unit</label><input type="text" id="indoorModel" value={formData.indoorModel} onChange={handleChange} className={inputCls} placeholder="FXQ20BY14" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Serial Number Indoor</label><input type="text" id="indoorSerial" value={formData.indoorSerial} onChange={handleChange} className={inputCls} placeholder="E000580" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Model Outdoor Unit</label><input type="text" id="outdoorModel" value={formData.outdoorModel} onChange={handleChange} className={inputCls} placeholder="RXQ20BY14" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Serial Number Outdoor</label><input type="text" id="outdoorSerial" value={formData.outdoorSerial} onChange={handleChange} className={inputCls} placeholder="E000580" /></div>
              </div>
            </div>

            {/* Card: Informasi Customer */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">👤</div>
                <div><div className="card-title text-sage-900 dark:text-white">Informasi Customer</div><div className="card-desc text-sage-500">Data pelanggan dan teknisi</div></div>
              </div>
              <div className="form-grid col-4">
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Nama Customer</label><input type="text" id="customerName" value={formData.customerName} onChange={handleChange} className={inputCls} placeholder="BPK MT Haryono" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Alamat</label><input type="text" id="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="South Jakarta Office" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Nama Teknisi</label><input type="text" id="technicianName" value={formData.technicianName} onChange={handleChange} className={inputCls} placeholder="Iwan Saputra" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">No Laporan</label><input type="text" id="reportNumber" value={formData.reportNumber} onChange={handleChange} className={inputCls} placeholder="00133772" /></div>
              </div>
            </div>

            {/* Card: Detail Kerusakan */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">⚠️</div>
                <div><div className="card-title text-sage-900 dark:text-white">Detail Kerusakan</div><div className="card-desc text-sage-500">Error code dan penyebab kerusakan</div></div>
              </div>
              <div className="form-grid col-4">
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Error Code</label><input type="text" id="errorCode" value={formData.errorCode} onChange={handleChange} className={inputCls} placeholder="U7" /></div>
                <div className="form-group">
                  <label className="form-label text-sage-700 dark:text-sage-300">Cause of Failure</label>
                  <select id="failureCause" value={formData.failureCause} onChange={handleChange} className={inputCls + " cursor-pointer"}>
                    <option value="46. KABEL ANTARA PCB TIDAK TERHUBUNG DENGAN BAIK">46. Kabel antara PCB tidak terhubung</option>
                    <option value="726. Konektor Kabel Listrik, Kabel [Komponen Listrik]">726. Konektor Kabel Listrik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label text-sage-700 dark:text-sage-300">Mode Operasi</label>
                  <select id="operationMode" value={formData.operationMode} onChange={handleChange} className={inputCls + " cursor-pointer"}>
                    <option value="Cool">❄️ Cool</option>
                    <option value="Heat">🔥 Heat</option>
                    <option value="Auto">🔄 Auto</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Setting Temp (°C)</label><input type="text" id="setTemp" value={formData.setTemp} onChange={handleChange} className={inputCls} placeholder="17" /></div>
              </div>
            </div>

            {/* Card: Tabel Pengukuran */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">📊</div>
                <div className="flex-1"><div className="card-title text-sage-900 dark:text-white">Tabel Pengukuran</div><div className="card-desc text-sage-500">Data pengukuran sebelum dan sesudah perbaikan</div></div>
                <button onClick={addMeasurementRow} className="flex items-center gap-1 text-sm bg-sage-200 hover:bg-sage-500 hover:text-white text-sage-800 dark:bg-sage-800 dark:hover:bg-sage-700 dark:text-sage-300 py-1.5 px-3 rounded-lg transition-colors font-semibold">
                  <Plus size={16} /> Tambah Baris
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="measure-form-table">
                  <thead>
                    <tr className="bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200">
                      <th className="rounded-tl-lg">Parameter</th><th>Satuan</th><th>Referensi</th><th>Before</th><th>After</th><th className="rounded-tr-lg w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map(m => (
                      <tr key={m.id} className="border-b border-sage-200 dark:border-sage-800/50">
                        <td><input type="text" value={m.parameter} onChange={e => handleMeasurementChange(m.id, 'parameter', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500" /></td>
                        <td className="w-20"><input type="text" value={m.unit} onChange={e => handleMeasurementChange(m.id, 'unit', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 text-center focus:border-sage-500" /></td>
                        <td className="w-28"><input type="text" value={m.reference} onChange={e => handleMeasurementChange(m.id, 'reference', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500" /></td>
                        <td className="w-28"><input type="text" value={m.before} onChange={e => handleMeasurementChange(m.id, 'before', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500" /></td>
                        <td className="w-28"><input type="text" value={m.after} onChange={e => handleMeasurementChange(m.id, 'after', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500" /></td>
                        <td className="text-center"><button onClick={() => removeMeasurementRow(m.id)} className="measure-delete-btn text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={17} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card: Catatan Teknisi */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">📝</div>
                <div><div className="card-title text-sage-900 dark:text-white">Catatan Teknisi</div><div className="card-desc text-sage-500">Diagnosis, hasil pengecekan, dan langkah perbaikan</div></div>
              </div>
              <div className="form-grid col-3">
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Diagnosis / Kerusakan</label><textarea id="diagnosis" value={formData.diagnosis} onChange={handleChange} className={textareaCls} placeholder="Cek unit lantai 2 ruang rapat..." /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Checking Result</label><textarea id="checkingResult" value={formData.checkingResult} onChange={handleChange} className={textareaCls} placeholder="Sudah di ganti kabel control..." /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Countermeasure</label><textarea id="countermeasure" value={formData.countermeasure} onChange={handleChange} className={textareaCls} placeholder="Saat ini unit sudah running..." /></div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="action-bar">
              <button onClick={generateReport} className="btn-generate">
                <span className="text-lg">🚀</span> Generate & Preview Report
              </button>
            </div>
          </section>
        )}

        {/* ===== PREVIEW SECTION ===== */}
        {currentPage === 'service-report' && showPreview && (
          <section className="preview-section">
            <div className="preview-topbar bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800 no-print">
              <div>
                <h2 className="text-lg font-bold text-sage-900 dark:text-white">📄 Preview Laporan</h2>
                <p className="text-sm text-sage-500">Periksa sebelum download</p>
              </div>
              <div className="preview-actions">
                <button onClick={() => setShowPreview(false)} className="btn-back bg-white dark:bg-sage-800 text-sage-700 dark:text-sage-200 border-[1.5px] border-sage-300 dark:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-700">
                  <ArrowLeft size={16} className="inline mr-1" /> Edit Data
                </button>
                <button onClick={() => window.print()} className="btn-download flex items-center gap-2">
                  <Download size={16} /> Cetak / Save PDF
                </button>
              </div>
            </div>

            <div id="printable-area" className="report-paper" ref={previewRef}>
              {/* Letterhead */}
              <div className="rpt-letterhead">
                <div>
                  <div className="rpt-company-name">Mitra Maju Sejati</div>
                  <div className="rpt-company-sub">Service & Maintenance AC Profesional</div>
                </div>
                <div className="rpt-badge">MMS</div>
              </div>

              <div className="rpt-title">SERVICE REPORT DETAIL</div>

              {/* Info Table */}
              <table className="rpt-info-table">
                <tbody>
                  <tr><td className="rpt-key">Unit (In / Out)</td><td>{formData.indoorModel || '-'} / {formData.outdoorModel || '-'}</td><td className="rpt-key">Serial Number</td><td>{formData.indoorSerial || '-'} / {formData.outdoorSerial || '-'}</td></tr>
                  <tr><td className="rpt-key">Customer</td><td>{formData.customerName}</td><td className="rpt-key">Alamat</td><td>{formData.address || '-'}</td></tr>
                  <tr><td className="rpt-key">Teknisi</td><td>{formData.technicianName || '-'}</td><td className="rpt-key">No Laporan</td><td>{formData.reportNumber}</td></tr>
                  <tr><td className="rpt-key">Error Code</td><td>{formData.errorCode || '-'}</td><td className="rpt-key">Mode Operasi</td><td>{formData.operationMode} / {formData.setTemp || '-'}°C</td></tr>
                  <tr><td className="rpt-key">Cause of Failure</td><td colSpan={3}>{formData.failureCause || '-'}</td></tr>
                </tbody>
              </table>

              {/* Diagnosis */}
              <div className="rpt-section-label">Diagnosa Kerusakan</div>
              <div className="rpt-block">{formData.diagnosis || '-'}</div>

              {/* Checking Result */}
              <div className="rpt-section-label">Hasil Pengecekan</div>
              <div className="rpt-block">{formData.checkingResult || '-'}</div>

              {/* Measurement Table */}
              <div className="rpt-section-label">Data Pengukuran</div>
              <table className="rpt-measure-table">
                <thead>
                  <tr><th>Data Pengukuran</th><th>Satuan</th><th>Referensi</th><th>Data Before</th><th>Data After</th></tr>
                </thead>
                <tbody>
                  {measurements.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontFamily: 'var(--font-body)' }}>{m.parameter || '-'}</td>
                      <td>{m.unit || '-'}</td><td>{m.reference || '-'}</td>
                      <td>{m.before || '-'}</td><td style={{ fontWeight: 600 }}>{m.after || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Countermeasure */}
              <div className="rpt-section-label">Countermeasure / Langkah Perbaikan</div>
              <div className="rpt-block-success">{formData.countermeasure || '-'}</div>

              {/* Footer */}
              <div className="rpt-footer">
                <span>No. Laporan: {formData.reportNumber}</span>
                <span>Mitra Maju Sejati — Service Report</span>
                <span>Dicetak: {new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </section>
        )}

        {/* ===== RIWAYAT PAGE ===== */}
        {currentPage === 'riwayat' && (
          <Riwayat reports={savedReports} onRefresh={refreshReports} onViewDetail={setViewingReport} />
        )}
      </main>

      {/* Toast */}
      {toast && <div className="toast bg-sage-700 text-white">{toast}</div>}

      {/* Modal */}
      {viewingReport && <ReportModal report={viewingReport} onClose={() => setViewingReport(null)} />}
    </div>
  );
}

export default App;
