import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Sun, Moon, Plus, Trash2, ArrowLeft, Download, FileText } from 'lucide-react';
import './index.css';

interface MeasurementData {
  id: string;
  parameter: string;
  unit: string;
  reference: string;
  before: string;
  after: string;
}

interface FormData {
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
    indoorModel: '',
    indoorSerial: '',
    outdoorModel: '',
    outdoorSerial: '',
    customerName: '',
    address: '',
    technicianName: '',
    reportNumber: '',
    errorCode: '',
    failureCause: '46. KABEL ANTARA PCB TIDAK TERHUBUNG DENGAN BAIK',
    operationMode: 'Cool',
    setTemp: '',
    diagnosis: '',
    checkingResult: '',
    countermeasure: '',
    reportDate: new Date().toISOString().split('T')[0]
  });

  const [measurements, setMeasurements] = useState<MeasurementData[]>(initialMeasurements);
  const [showPreview, setShowPreview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formError, setFormError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Pre-fill data
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      indoorModel: 'FXQ20BY14',
      outdoorModel: 'RXQ20BY14',
      outdoorSerial: 'E000580',
      customerName: 'BPK MT Haryono',
      address: 'South Jakarta Office',
      technicianName: 'Iwan Saputra',
      reportNumber: '00133772',
      errorCode: 'U7',
      setTemp: '17',
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formError) setFormError('');
  };

  const handleMeasurementChange = (id: string, field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMeasurementRow = () => {
    const newId = Date.now().toString();
    setMeasurements(prev => [...prev, { id: newId, parameter: '', unit: '', reference: '', before: '', after: '' }]);
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
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToForm = () => {
    setShowPreview(false);
  };

  const downloadPDF = () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const wasDark = document.documentElement.classList.contains('dark');
    if (wasDark) document.documentElement.classList.remove('dark');

    const opt = {
      margin: 10,
      filename: `Service-Report-${formData.reportNumber || '0000'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    setTimeout(() => {
      html2pdf().from(previewElement).set(opt).save().then(() => {
        if (wasDark) document.documentElement.classList.add('dark');
      });
    }, 100);
  };

  const InputLabel = ({ htmlFor, children, required }: { htmlFor: string, children: React.ReactNode, required?: boolean }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-sage-900 dark:text-sage-100 mb-1">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="min-h-screen bg-sage-100 dark:bg-sage-950 text-sage-900 dark:text-sage-50 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-sage-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* HEADER */}
        <div className="bg-sage-700 dark:bg-sage-800 p-8 text-center relative border-b border-transparent dark:border-sage-800">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FileText size={32} /> Service Report Generator
          </h1>
          <p className="text-sage-100 text-sm">Buat laporan service AC profesional dengan mudah</p>
        </div>

        {/* FORM SECTION */}
        {!showPreview && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-sage-900 dark:text-white mb-6 border-b pb-2 dark:border-sage-800 border-sage-300">📋 Form Data Service</h2>

            {formError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                <span className="text-xl">⚠️</span> {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Unit Info */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <InputLabel htmlFor="indoorModel" required>Model Indoor</InputLabel>
                  <input type="text" id="indoorModel" value={formData.indoorModel} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="indoorSerial">SN Indoor</InputLabel>
                  <input type="text" id="indoorSerial" value={formData.indoorSerial} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="outdoorModel" required>Model Outdoor</InputLabel>
                  <input type="text" id="outdoorModel" value={formData.outdoorModel} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="outdoorSerial">SN Outdoor</InputLabel>
                  <input type="text" id="outdoorSerial" value={formData.outdoorSerial} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
              </div>

              {/* Customer Info */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <InputLabel htmlFor="customerName" required>Nama Customer</InputLabel>
                  <input type="text" id="customerName" value={formData.customerName} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <InputLabel htmlFor="address">Alamat</InputLabel>
                  <input type="text" id="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="technicianName">Teknisi</InputLabel>
                  <input type="text" id="technicianName" value={formData.technicianName} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
              </div>

              {/* Settings */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <InputLabel htmlFor="reportNumber" required>No Laporan</InputLabel>
                  <input type="text" id="reportNumber" value={formData.reportNumber} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="reportDate">Tanggal Pekerjaan</InputLabel>
                  <input type="date" id="reportDate" value={formData.reportDate} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="errorCode">Error Code</InputLabel>
                  <input type="text" id="errorCode" value={formData.errorCode} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
                <div>
                  <InputLabel htmlFor="setTemp">Setting Temp (°C)</InputLabel>
                  <input type="text" id="setTemp" value={formData.setTemp} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all" />
                </div>
              </div>

              {/* Selects */}
              <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputLabel htmlFor="failureCause">Cause of Failure</InputLabel>
                  <select id="failureCause" value={formData.failureCause} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all">
                    <option value="46. KABEL ANTARA PCB TIDAK TERHUBUNG DENGAN BAIK">46. KABEL ANTARA PCB TIDAK TERHUBUNG DENGAN BAIK</option>
                    <option value="726. Konektor Kabel Listrik, Kabel [Komponen Listrik]">726. Konektor Kabel Listrik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <InputLabel htmlFor="operationMode">Mode Operasi</InputLabel>
                  <select id="operationMode" value={formData.operationMode} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all">
                    <option value="Cool">Cool</option>
                    <option value="Heat">Heat</option>
                    <option value="Auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Measurement Table Form */}
            <div className="mb-8 bg-sage-100 dark:bg-sage-950 p-6 rounded-xl border border-sage-300 dark:border-sage-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-sage-900 dark:text-white">📊 Tabel Pengukuran (Dinamis)</h3>
                <button onClick={addMeasurementRow} className="flex items-center gap-1 text-sm bg-sage-300 hover:bg-sage-500 hover:text-white text-sage-900 dark:bg-sage-800/60 dark:hover:bg-sage-700/60 dark:text-sage-300 py-1.5 px-3 rounded-lg transition-colors">
                  <Plus size={16} /> Tambah Baris
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-sage-300 dark:bg-sage-800 text-sage-900 dark:text-sage-100">
                    <tr>
                      <th className="px-4 py-2 rounded-tl-lg">Parameter</th>
                      <th className="px-4 py-2">Satuan</th>
                      <th className="px-4 py-2">Referensi</th>
                      <th className="px-4 py-2">Before</th>
                      <th className="px-4 py-2">After</th>
                      <th className="px-4 py-2 rounded-tr-lg w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((m) => (
                      <tr key={m.id} className="border-b border-sage-300 dark:border-sage-800/50">
                        <td className="p-2"><input type="text" value={m.parameter} onChange={(e) => handleMeasurementChange(m.id, 'parameter', e.target.value)} className="w-full p-1.5 bg-white dark:bg-sage-900 border border-sage-300 dark:border-sage-700 rounded focus:ring-1 focus:ring-sage-500 outline-none" /></td>
                        <td className="p-2 w-24"><input type="text" value={m.unit} onChange={(e) => handleMeasurementChange(m.id, 'unit', e.target.value)} className="w-full p-1.5 bg-white dark:bg-sage-900 border border-sage-300 dark:border-sage-700 rounded text-center focus:ring-1 focus:ring-sage-500 outline-none" /></td>
                        <td className="p-2 w-32"><input type="text" value={m.reference} onChange={(e) => handleMeasurementChange(m.id, 'reference', e.target.value)} className="w-full p-1.5 bg-white dark:bg-sage-900 border border-sage-300 dark:border-sage-700 rounded focus:ring-1 focus:ring-sage-500 outline-none" /></td>
                        <td className="p-2 w-32"><input type="text" value={m.before} onChange={(e) => handleMeasurementChange(m.id, 'before', e.target.value)} className="w-full p-1.5 bg-white dark:bg-sage-900 border border-sage-300 dark:border-sage-700 rounded focus:ring-1 focus:ring-sage-500 outline-none" /></td>
                        <td className="p-2 w-32"><input type="text" value={m.after} onChange={(e) => handleMeasurementChange(m.id, 'after', e.target.value)} className="w-full p-1.5 bg-white dark:bg-sage-900 border border-sage-300 dark:border-sage-700 rounded focus:ring-1 focus:ring-sage-500 outline-none" /></td>
                        <td className="p-2 text-center">
                          <button onClick={() => removeMeasurementRow(m.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Textarea Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2">
                <InputLabel htmlFor="diagnosis">Diagnosis / Kerusakan</InputLabel>
                <textarea id="diagnosis" value={formData.diagnosis} onChange={handleChange} className="w-full p-3 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all min-h-[100px]"></textarea>
              </div>
              <div>
                <InputLabel htmlFor="checkingResult">Hasil Pengecekan</InputLabel>
                <textarea id="checkingResult" value={formData.checkingResult} onChange={handleChange} className="w-full p-3 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all min-h-[100px]"></textarea>
              </div>
              <div>
                <InputLabel htmlFor="countermeasure">Langkah Perbaikan</InputLabel>
                <textarea id="countermeasure" value={formData.countermeasure} onChange={handleChange} className="w-full p-3 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 focus:ring-2 focus:ring-sage-500 outline-none transition-all min-h-[100px]"></textarea>
              </div>
            </div>

            <button onClick={generateReport} className="w-full bg-sage-500 hover:bg-sage-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2">
              <FileText /> Generate Preview
            </button>
          </div>
        )}

        {/* ===== PREVIEW SECTION ===== */}
        {showPreview && (
          <div className="p-8 bg-sage-100 dark:bg-sage-950 border-t-4 border-sage-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sage-900 dark:text-white">📄 Preview Report</h2>
              <div className="flex gap-3">
                <button onClick={backToForm} className="flex items-center gap-2 bg-sage-700 hover:bg-sage-900 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  <ArrowLeft size={18} /> Edit Data
                </button>
                <button onClick={downloadPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium shadow-md transition-colors">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
            
            {/* PDF Content Area */}
            <div className="bg-white text-black p-10 rounded-xl shadow-md mx-auto" style={{ maxWidth: '210mm' }} ref={previewRef}>
              <div className="text-center text-3xl font-bold mb-8 text-sage-900 uppercase tracking-wide border-b-2 border-sage-300 pb-4">
                Service Report Detail
              </div>

              {/* Info Utama */}
              <table className="w-full text-sm mb-6 border-collapse avoid-page-break">
                <tbody>
                  {[
                    ['Unit (In / Out)', `${formData.indoorModel || '-'} / ${formData.outdoorModel || '-'}`],
                    ['Serial Number', `${formData.indoorSerial || '-'} / ${formData.outdoorSerial || '-'}`],
                    ['Customer', formData.customerName],
                    ['Alamat', formData.address || '-'],
                    ['Teknisi', formData.technicianName || '-'],
                    ['Tanggal Pekerjaan', new Date(formData.reportDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })],
                    ['Error Code', formData.errorCode || '-'],
                    ['Cause of Failure', formData.failureCause || '-'],
                    ['Mode Operasi', formData.operationMode],
                    ['Setting Temp', `${formData.setTemp || '-'} °C`]
                  ].map(([label, value], i) => (
                    <tr key={i} className="border-b border-sage-100 last:border-0">
                      <td className="py-2 w-1/3 font-bold text-sage-900">{label}</td>
                      <td className="py-2 text-sage-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Diagnosa */}
              <div className="mb-6 avoid-page-break bg-sage-100/50 p-4 rounded-lg border border-sage-300">
                <h3 className="text-base font-bold text-sage-900 mb-2">Diagnosa Kerusakan:</h3>
                <p className="text-sm text-sage-900 whitespace-pre-wrap">{formData.diagnosis || '-'}</p>
              </div>

              {/* Hasil Pengecekan */}
              <div className="mb-6 avoid-page-break bg-sage-100/50 p-4 rounded-lg border border-sage-300">
                <h3 className="text-base font-bold text-sage-900 mb-2">Hasil Pengecekan:</h3>
                <p className="text-sm text-sage-900 whitespace-pre-wrap">{formData.checkingResult || '-'}</p>
              </div>

              {/* Tabel Pengukuran */}
              <div className="mb-6 avoid-page-break">
                <table className="w-full text-sm border-collapse border border-sage-300 text-center">
                  <thead>
                    <tr className="bg-sage-700 text-white">
                      <th className="border border-sage-300 p-2 text-left">Data Pengukuran</th>
                      <th className="border border-sage-300 p-2">Satuan</th>
                      <th className="border border-sage-300 p-2">Referensi</th>
                      <th className="border border-sage-300 p-2">Data Before</th>
                      <th className="border border-sage-300 p-2">Data After</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    {measurements.map(m => (
                      <tr key={m.id} className="odd:bg-sage-100/30">
                        <td className="border border-sage-300 p-2 text-left font-sans">{m.parameter || '-'}</td>
                        <td className="border border-sage-300 p-2">{m.unit || '-'}</td>
                        <td className="border border-sage-300 p-2">{m.reference || '-'}</td>
                        <td className="border border-sage-300 p-2">{m.before || '-'}</td>
                        <td className="border border-sage-300 p-2 font-bold">{m.after || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Countermeasure */}
              <div className="mb-8 avoid-page-break bg-sage-300/30 p-4 rounded-lg border border-sage-500">
                <h3 className="text-base font-bold text-sage-900 mb-2">Countermeasure / Langkah Perbaikan:</h3>
                <p className="text-sm text-sage-900 whitespace-pre-wrap">{formData.countermeasure || '-'}</p>
              </div>

              {/* Footer */}
              <div className="mt-12 text-xs text-sage-500 text-right border-t border-sage-300 pt-4 avoid-page-break flex justify-between">
                <span>Generated via Service Report App</span>
                <span>No Laporan: <strong className="text-sage-900">{formData.reportNumber}</strong> | Cetak: {new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
