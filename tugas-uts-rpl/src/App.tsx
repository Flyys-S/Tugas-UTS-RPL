import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Plus, Trash2, ArrowLeft, Download, FileText } from 'lucide-react';
import './index.css';
import type { MeasurementData, FormData, SavedReport, Customer, Page } from './types';
import { getAllReports, saveReport, getAllCustomers, ensureCustomer } from './storage';
import Riwayat from './components/Riwayat';
import ReportModal from './components/ReportModal';
import CustomerPage from './components/Customer';

const initialMeasurements: MeasurementData[] = [
  { id: '1.0', category: 'Kelistrikan / Electricity', parameter: '1.0. Voltage (220-240V)', unit: 'V', reference: 'Drop Voltage ± 10%', before: '', after: '' },
  { id: '1.1', category: 'Kelistrikan / Electricity', parameter: '1.1. Voltage - (R - S) (380 - 410 V)', unit: 'V', reference: 'unbalance ± 2%', before: '', after: '' },
  { id: '1.2', category: 'Kelistrikan / Electricity', parameter: '1.2. Voltage - (S - T) (380 - 410 V)', unit: 'V', reference: 'unbalance ± 2%', before: '', after: '' },
  { id: '1.3', category: 'Kelistrikan / Electricity', parameter: '1.3. Voltage - (R - T) (380 - 410 V)', unit: 'V', reference: 'unbalance ± 2%', before: '', after: '' },
  { id: '1.4', category: 'Kelistrikan / Electricity', parameter: '1.4. Ampere Total', unit: 'A', reference: '', before: '', after: '' },
  { id: '1.5', category: 'Kelistrikan / Electricity', parameter: '1.5. Ampere Comp', unit: 'A', reference: '', before: '', after: '' },
  
  { id: '2.1', category: 'Suhu / Temperature', parameter: '2.1. Temperatur Evaporator (TE)', unit: '°C', reference: 'Factory Setting 6°C', before: '', after: '' },
  { id: '2.2', category: 'Suhu / Temperature', parameter: '2.2. Temperature Kondensor (TC)', unit: '°C', reference: 'Temperatur Ambient + 15 hingga 20°C', before: '', after: '' },
  { id: '2.3', category: 'Suhu / Temperature', parameter: '2.3. Pipa Discharge', unit: '°C', reference: 'Temperatur kondensor + 20 hingga 25°C', before: '', after: '' },
  { id: '2.4', category: 'Suhu / Temperature', parameter: '2.4. Pipa Hisap (Suction)', unit: '°C', reference: 'Temperatur Evaporator + 2 hingga 8°C', before: '', after: '' },
  { id: '2.5', category: 'Suhu / Temperature', parameter: '2.5. Inlet Outdoor Air', unit: '°C', reference: '', before: '', after: '' },
  { id: '2.6', category: 'Suhu / Temperature', parameter: '2.6. Outlet Outdoor Air', unit: '°C', reference: '', before: '', after: '' },
  { id: 'dt-out', category: 'Suhu / Temperature', parameter: 'Δ T (Outlet - Inlet)', unit: '°C', reference: 'Temp Return + 12 s.d 18', before: '', after: '' },
  { id: '2.7', category: 'Suhu / Temperature', parameter: '2.7. Inlet Indoor Air', unit: '°C', reference: '', before: '', after: '' },
  { id: '2.8', category: 'Suhu / Temperature', parameter: '2.8. Outlet Indoor Air', unit: '°C', reference: '', before: '', after: '' },
  { id: 'dt-in', category: 'Suhu / Temperature', parameter: 'Δ T (Outlet - Inlet)', unit: '°C', reference: 'Temp Return + 7 s.d 13', before: '', after: '' },
  { id: '2.9', category: 'Suhu / Temperature', parameter: '2.9. Ambient Temp', unit: '°C', reference: '35 - 40 (tergantung Model)', before: '', after: '' },

  { id: '3.1-l', category: 'Tekanan / Presure', parameter: '3.1. Sebelum - Low', unit: 'Mpag/psig', reference: 'Sama dengan tekanan Saturasi Temperatur ambient', before: '', after: '' },
  { id: '3.1-h', category: 'Tekanan / Presure', parameter: '3.1. Sebelum - High', unit: 'Mpag/psig', reference: '', before: '', after: '' },
  { id: '3.2-l', category: 'Tekanan / Presure', parameter: '3.2. Saat Beroperasi - Low', unit: 'Mpag/psig', reference: '0,5 - 1.1 Mpag\n72,6 - 159,5 psig', before: '', after: '' },
  { id: '3.2-h', category: 'Tekanan / Presure', parameter: '3.2. Saat Beroperasi - High', unit: 'Mpag/psig', reference: '<5 HP\n2.1 - 3.3 Mpa\n304,5 - 478,6 psig', before: '', after: '' },
];

function App() {
  const [formData, setFormData] = useState<FormData>({
    indoorModel: '', indoorSerial: '', outdoorModel: '', outdoorSerial: '',
    customerName: '', address: '', technicianName: '', technicianCodeBranch: '', reportNumber: '',
    errorCode: '', failureCause: '', placeOfFailure: '',
    operationMode: '', setTemp: '', fanSpeed: '', statusOperation: '',
    installationDate: '', deliveryDate: '', endDate: '',
    diagnosis: '', checkingResult: '', sparePartDamage: '',
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const refreshReports = async () => setSavedReports(await getAllReports());
  const refreshCustomers = async () => setCustomers(await getAllCustomers());
  useEffect(() => { refreshReports(); refreshCustomers(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleMeasurementChange = (id: string, field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const generateReport = async () => {
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
    await saveReport(report);
    // Auto-save customer
    await ensureCustomer(formData.customerName, formData.address);
    refreshReports();
    refreshCustomers();
    setToast('✅ Laporan tersimpan ke riwayat!');
    setTimeout(() => setToast(''), 3000);
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCustomer = (c: Customer) => {
    setFormData(prev => ({ ...prev, customerName: c.name, address: c.address }));
    setShowSuggestions(false);
  };

  const customerSuggestions = formData.customerName.trim().length >= 1
    ? customers.filter(c => c.name.toLowerCase().includes(formData.customerName.toLowerCase()))
    : [];

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setShowPreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitles: Record<Page, string> = { 'service-report': 'Service Report Generator', riwayat: 'Riwayat Laporan', customer: 'Data Customer' };
  const pageTitle = pageTitles[currentPage];
  const pageDescs: Record<Page, string> = { 'service-report': 'Buat laporan servis AC profesional dalam hitungan detik', riwayat: 'Lihat dan kelola semua laporan servis', customer: 'Kelola data pelanggan' };
  const pageDesc = pageDescs[currentPage];

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
          <button className={`nav-item ${currentPage === 'customer' ? 'active' : ''}`} onClick={() => navigateTo('customer')}><span className="nav-icon">👤</span><span>Customer</span></button>
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
            <p className="page-subtitle text-sage-500">{pageDesc}</p>
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
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Model Indoor Unit</label><input type="text" id="indoorModel" value={formData.indoorModel} onChange={handleChange} className={inputCls} placeholder="Masukkan model indoor" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Serial Number Indoor</label><input type="text" id="indoorSerial" value={formData.indoorSerial} onChange={handleChange} className={inputCls} placeholder="Masukkan serial number" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Model Outdoor Unit</label><input type="text" id="outdoorModel" value={formData.outdoorModel} onChange={handleChange} className={inputCls} placeholder="Masukkan model outdoor" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Serial Number Outdoor</label><input type="text" id="outdoorSerial" value={formData.outdoorSerial} onChange={handleChange} className={inputCls} placeholder="Masukkan serial number" /></div>
              </div>
            </div>

            {/* Card: Informasi Customer */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">👤</div>
                <div><div className="card-title text-sage-900 dark:text-white">Informasi Customer</div><div className="card-desc text-sage-500">Data pelanggan dan teknisi</div></div>
              </div>
              <div className="form-grid col-4">
                <div className="form-group relative">
                  <label className="form-label text-sage-700 dark:text-sage-300">Nama Customer</label>
                  <input type="text" id="customerName" value={formData.customerName} onChange={(e) => { handleChange(e); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className={inputCls} placeholder="Ketik nama customer..." autoComplete="off" />
                  {showSuggestions && customerSuggestions.length > 0 && (
                    <div className="autocomplete-dropdown bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-700">
                      {customerSuggestions.map(c => (
                        <button key={c.id} className="autocomplete-item text-sage-900 dark:text-sage-100 hover:bg-sage-50 dark:hover:bg-sage-800" onMouseDown={() => selectCustomer(c)}>
                          <span className="font-semibold">{c.name}</span>
                          {c.address && <span className="text-xs text-sage-500 ml-2">— {c.address}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Alamat</label><input type="text" id="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="Masukkan alamat lengkap" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Nama Teknisi</label><input type="text" id="technicianName" value={formData.technicianName} onChange={handleChange} className={inputCls} placeholder="Masukkan nama teknisi" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Kode Teknisi/Cabang</label><input type="text" id="technicianCodeBranch" value={formData.technicianCodeBranch} onChange={handleChange} className={inputCls} placeholder="Masukkan kode teknisi/cabang" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">No Laporan</label><input type="text" id="reportNumber" value={formData.reportNumber} onChange={handleChange} className={inputCls} placeholder="Masukkan no laporan" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Installation Date</label><input type="text" id="installationDate" value={formData.installationDate} onChange={handleChange} className={inputCls} placeholder="Misal: 15 April 2026" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Delivery Date</label><input type="text" id="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className={inputCls} placeholder="Misal: 01 January 1999" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">End Date</label><input type="text" id="endDate" value={formData.endDate} onChange={handleChange} className={inputCls} placeholder="Misal: 15 April 2026" /></div>
              </div>
            </div>

            {/* Card: Detail Kerusakan */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">⚠️</div>
                <div><div className="card-title text-sage-900 dark:text-white">Detail Kerusakan</div><div className="card-desc text-sage-500">Error code dan penyebab kerusakan</div></div>
              </div>
              <div className="form-grid col-4">
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Error Code</label><input type="text" id="errorCode" value={formData.errorCode} onChange={handleChange} className={inputCls} placeholder="Masukkan kode error" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Cause of Failure</label><input type="text" id="failureCause" value={formData.failureCause} onChange={handleChange} className={inputCls} placeholder="46. KABEL ANTARA PCB..." /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Place of Failure</label><input type="text" id="placeOfFailure" value={formData.placeOfFailure} onChange={handleChange} className={inputCls} placeholder="726. Konektor Kabel Listrik..." /></div>
                <div className="form-group">
                  <label className="form-label text-sage-700 dark:text-sage-300">Mode Operasi</label>
                  <select id="operationMode" value={formData.operationMode} onChange={handleChange} className={inputCls + " cursor-pointer"}>
                    <option value="" disabled>Pilih mode...</option>
                    <option value="Cool">❄️ Cool</option>
                    <option value="Heat">🔥 Heat</option>
                    <option value="Auto">🔄 Auto</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Setting Temp (°C)</label><input type="text" id="setTemp" value={formData.setTemp} onChange={handleChange} className={inputCls} placeholder="Suhu (°C)" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Fan Speed</label><input type="text" id="fanSpeed" value={formData.fanSpeed} onChange={handleChange} className={inputCls} placeholder="Misal: High" /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Status Operation</label><input type="text" id="statusOperation" value={formData.statusOperation} onChange={handleChange} className={inputCls} placeholder="Status operasi" /></div>
              </div>
            </div>

            {/* Card: Tabel Pengukuran */}
            <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
              <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
                <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">📊</div>
                <div className="flex-1"><div className="card-title text-sage-900 dark:text-white">Tabel Pengukuran</div><div className="card-desc text-sage-500">Data pengukuran berdasarkan standar form</div></div>
              </div>
              <div className="overflow-x-auto">
                <table className="measure-form-table">
                  <thead>
                    <tr className="bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200">
                      <th className="rounded-tl-lg">Kategori</th><th>Parameter</th><th>Satuan</th><th>Referensi</th><th>Before</th><th className="rounded-tr-lg">After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map(m => (
                      <tr key={m.id} className="border-b border-sage-200 dark:border-sage-800/50">
                        <td className="text-xs font-semibold text-sage-600 dark:text-sage-400 max-w-[120px] whitespace-normal">{m.category}</td>
                        <td className="w-48"><input type="text" value={m.parameter} onChange={e => handleMeasurementChange(m.id, 'parameter', e.target.value)} className="measure-input bg-sage-50 dark:bg-sage-900 border-transparent text-sage-700 dark:text-sage-300 pointer-events-none" readOnly /></td>
                        <td className="w-24"><input type="text" value={m.unit} onChange={e => handleMeasurementChange(m.id, 'unit', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 text-center focus:border-sage-500" /></td>
                        <td className="w-32"><textarea value={m.reference} onChange={e => handleMeasurementChange(m.id, 'reference', e.target.value)} className="measure-input form-textarea bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500 !min-h-[40px] py-1 text-xs" /></td>
                        <td className="w-28"><input type="text" value={m.before} onChange={e => handleMeasurementChange(m.id, 'before', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500" /></td>
                        <td className="w-28"><input type="text" value={m.after} onChange={e => handleMeasurementChange(m.id, 'after', e.target.value)} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500" /></td>
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
              <div className="form-grid col-2">
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Faulty Diagnosis / Diagnosa Kerusakan</label><textarea id="diagnosis" value={formData.diagnosis} onChange={handleChange} className={textareaCls} placeholder="Cek unit lantai 2 ruang rapat..." /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Checking Result / Hasil Pengecekan</label><textarea id="checkingResult" value={formData.checkingResult} onChange={handleChange} className={textareaCls} placeholder="Sudah di ganti kabel control..." /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Data Pengukuran Spare part Rusak</label><textarea id="sparePartDamage" value={formData.sparePartDamage} onChange={handleChange} className={textareaCls} placeholder="Komponen yang rusak..." /></div>
                <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Countermeasure / Langkah Perbaikan</label><textarea id="countermeasure" value={formData.countermeasure} onChange={handleChange} className={textareaCls} placeholder="Saat ini unit sudah running..." /></div>
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

        {/* ===== CUSTOMER PAGE ===== */}
        {currentPage === 'customer' && (
          <CustomerPage customers={customers} onRefresh={refreshCustomers} />
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
