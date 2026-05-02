import { X, Download } from 'lucide-react';
import type { SavedReport } from '../types';

interface Props {
  report: SavedReport;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: Props) {
  const { formData, measurements } = report;

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const html = `<html><head><title>Service Report - ${formData.reportNumber}</title>
      <style>
      body { font-family: Arial, sans-serif; padding: 20px; font-size: 11px; color: #000; line-height: 1.2; }
      h2 { text-align: center; margin: 0 0 15px 0; font-size: 18px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
      th, td { border: 1px solid #000; padding: 4px 6px; vertical-align: middle; }
      th { background-color: #d9d9d9; font-weight: bold; text-align: center; }
      .flex-container { display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; }
      .half-table { width: 50%; }
      .bg-gray { background-color: #d9d9d9; font-weight: bold; }
      .text-center { text-align: center; }
      .text-bold { font-weight: bold; }
      .p-2 { padding: 6px; }
      .mb-2 { margin-bottom: 10px; }
      </style></head><body>
      <h2>Service Report</h2>
      <div class="flex-container">
        <table class="half-table">
          <tr><th>Detail Unit</th><th>Model Unit</th><th>Serial Number</th></tr>
          <tr><td>Indoor Unit</td><td>: ${formData.indoorModel || ''}</td><td>: ${formData.indoorSerial || ''}</td></tr>
          <tr><td>Outdoor Unit</td><td>: ${formData.outdoorModel || ''}</td><td>: ${formData.outdoorSerial || ''}</td></tr>
          <tr><td>Error Code</td><td colspan="2">: ${formData.errorCode || ''}</td></tr>
          <tr><td>Cause of Failure</td><td colspan="2">: ${formData.failureCause || ''}</td></tr>
          <tr><td>Place of Failure</td><td colspan="2">: ${formData.placeOfFailure || ''}</td></tr>
          <tr><td>Mode Operasi</td><td colspan="2" class="text-center">${formData.operationMode || ''}</td></tr>
          <tr><td>Setting Temp</td><td colspan="2" class="text-center">${formData.setTemp || ''}</td></tr>
          <tr><td>Fan Speed</td><td colspan="2" class="text-center">${formData.fanSpeed || ''}</td></tr>
          <tr><td>Status Operation</td><td colspan="2" class="text-center">${formData.statusOperation || ''}</td></tr>
        </table>
        
        <table class="half-table">
          <tr><th colspan="2">Customer/Teknisi Detail</th></tr>
          <tr><td>Nama Teknisi</td><td>${formData.technicianName || ''}</td></tr>
          <tr><td>Kode teknisi/Cabang</td><td>${formData.technicianCodeBranch || ''}</td></tr>
          <tr><td>No Laporan</td><td>${formData.reportNumber || ''}</td></tr>
          <tr><td>Nama Customer</td><td>${formData.customerName || ''}</td></tr>
          <tr><td>Alamat</td><td>${formData.address || ''}</td></tr>
          <tr><td>Installation date</td><td>${formData.installationDate || ''}</td></tr>
          <tr><td>Delivery Date</td><td>${formData.deliveryDate || ''}</td></tr>
          <tr><td>End Date</td><td>${formData.endDate || ''}</td></tr>
        </table>
      </div>

      <table>
        <thead>
          <tr>
            <th colspan="2" style="width: 25%;">Data Pengukuran</th>
            <th style="width: 8%;">Satuan</th>
            <th style="width: 17%;">Referensi</th>
            <th style="width: 12.5%;">Data Before ①</th>
            <th style="width: 12.5%;">Data After ②</th>
            <th style="width: 25%; text-align: left; padding: 2px;">
              <div class="bg-gray" style="padding: 4px;">Faulty Diagnosis / Diagnosa Kerusakan:</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Kelistrikan -->
          <tr>
            <td rowspan="6" class="text-center" style="vertical-align: middle;">❶<br/>Kelistrikan /<br/>Electricity</td>
            <td>${measurements[0]?.parameter || ''}</td><td class="text-center">${measurements[0]?.unit || ''}</td><td class="text-center" style="white-space: pre-wrap;">${measurements[0]?.reference || ''}</td><td class="text-center">${measurements[0]?.before || ''}</td><td class="text-center text-bold">${measurements[0]?.after || ''}</td>
            <td rowspan="21" style="vertical-align: top; padding: 0;">
              <div class="p-2 mb-2" style="white-space: pre-wrap;">${formData.diagnosis || '\n\n'}</div>
              <div class="bg-gray" style="padding: 4px; border-bottom: 1px solid #000; border-top: 1px solid #000;">Checking result / Hasil Pengecekan :</div>
              <div class="p-2 mb-2" style="white-space: pre-wrap;">${formData.checkingResult || '\n\n\n\n'}</div>
              <div class="bg-gray" style="padding: 4px; border-bottom: 1px solid #000; border-top: 1px solid #000;">Data Pengukuran Spare part Rusak :</div>
              <div class="p-2 mb-2" style="white-space: pre-wrap;">${formData.sparePartDamage || '\n\n\n\n'}</div>
              <div class="bg-gray" style="padding: 4px; border-bottom: 1px solid #000; border-top: 1px solid #000;">Countermeasure / Langkah Perbaikan :</div>
              <div class="p-2" style="white-space: pre-wrap;">${formData.countermeasure || '\n\n\n\n'}</div>
            </td>
          </tr>
          ${measurements.slice(1, 6).map(m => `<tr><td>${m.parameter}</td><td class="text-center">${m.unit}</td><td class="text-center" style="white-space: pre-wrap;">${m.reference}</td><td class="text-center">${m.before}</td><td class="text-center text-bold">${m.after}</td></tr>`).join('')}
          
          <!-- Suhu -->
          <tr>
            <td rowspan="11" class="text-center" style="vertical-align: middle;">❷<br/>Suhu /<br/>Temperature</td>
            <td>${measurements[6]?.parameter || ''}</td><td class="text-center">${measurements[6]?.unit || ''}</td><td class="text-center" style="white-space: pre-wrap;">${measurements[6]?.reference || ''}</td><td class="text-center">${measurements[6]?.before || ''}</td><td class="text-center text-bold">${measurements[6]?.after || ''}</td>
          </tr>
          ${measurements.slice(7, 17).map(m => `<tr><td>${m.parameter}</td><td class="text-center">${m.unit}</td><td class="text-center" style="white-space: pre-wrap;">${m.reference}</td><td class="text-center">${m.before}</td><td class="text-center text-bold">${m.after}</td></tr>`).join('')}

          <!-- Tekanan -->
          <tr>
            <td rowspan="4" class="text-center" style="vertical-align: middle;">❸<br/>Tekanan /<br/>Presure</td>
            <td>${measurements[17]?.parameter || ''}</td><td class="text-center">${measurements[17]?.unit || ''}</td><td class="text-center" style="white-space: pre-wrap;">${measurements[17]?.reference || ''}</td><td class="text-center">${measurements[17]?.before || ''}</td><td class="text-center text-bold">${measurements[17]?.after || ''}</td>
          </tr>
          ${measurements.slice(18, 21).map(m => `<tr><td>${m.parameter}</td><td class="text-center">${m.unit}</td><td class="text-center" style="white-space: pre-wrap;">${m.reference}</td><td class="text-center">${m.before}</td><td class="text-center text-bold">${m.after}</td></tr>`).join('')}
        </tbody>
      </table>
      </body></html>`;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-white dark:bg-sage-900 rounded-t-xl p-4 border-[1.5px] border-sage-300 dark:border-sage-800 border-b-0">
          <div>
            <h3 className="font-bold text-sage-900 dark:text-white">📄 Preview Laporan - {formData.reportNumber}</h3>
            <p className="text-xs text-sage-500">Preview sesuai format PDF asli.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn-download flex items-center gap-2 text-sm !py-2 !px-3"><Download size={15}/> Cetak PDF</button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-800 text-sage-500"><X size={18}/></button>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white p-8 max-h-[80vh] overflow-y-auto !rounded-t-none border-[1.5px] border-sage-300 dark:border-sage-800 text-black">
          <h2 className="text-center font-bold text-xl mb-4">Service Report</h2>
          
          <div className="flex gap-4 mb-4">
            <table className="w-1/2 border-collapse text-[11px] print-table">
              <thead><tr><th className="border border-black bg-gray-200 p-1">Detail Unit</th><th className="border border-black bg-gray-200 p-1">Model Unit</th><th className="border border-black bg-gray-200 p-1">Serial Number</th></tr></thead>
              <tbody>
                <tr><td className="border border-black p-1">Indoor Unit</td><td className="border border-black p-1">: {formData.indoorModel}</td><td className="border border-black p-1">: {formData.indoorSerial}</td></tr>
                <tr><td className="border border-black p-1">Outdoor Unit</td><td className="border border-black p-1">: {formData.outdoorModel}</td><td className="border border-black p-1">: {formData.outdoorSerial}</td></tr>
                <tr><td className="border border-black p-1">Error Code</td><td className="border border-black p-1" colSpan={2}>: {formData.errorCode}</td></tr>
                <tr><td className="border border-black p-1">Cause of Failure</td><td className="border border-black p-1" colSpan={2}>: {formData.failureCause}</td></tr>
                <tr><td className="border border-black p-1">Place of Failure</td><td className="border border-black p-1" colSpan={2}>: {formData.placeOfFailure}</td></tr>
                <tr><td className="border border-black p-1">Mode Operasi</td><td className="border border-black p-1 text-center" colSpan={2}>{formData.operationMode}</td></tr>
                <tr><td className="border border-black p-1">Setting Temp</td><td className="border border-black p-1 text-center" colSpan={2}>{formData.setTemp}</td></tr>
                <tr><td className="border border-black p-1">Fan Speed</td><td className="border border-black p-1 text-center" colSpan={2}>{formData.fanSpeed}</td></tr>
                <tr><td className="border border-black p-1">Status Operation</td><td className="border border-black p-1 text-center" colSpan={2}>{formData.statusOperation}</td></tr>
              </tbody>
            </table>
            
            <table className="w-1/2 border-collapse text-[11px] print-table">
              <thead><tr><th className="border border-black bg-gray-200 p-1" colSpan={2}>Customer/Teknisi Detail</th></tr></thead>
              <tbody>
                <tr><td className="border border-black p-1 w-[40%]">Nama Teknisi</td><td className="border border-black p-1">{formData.technicianName}</td></tr>
                <tr><td className="border border-black p-1">Kode teknisi/Cabang</td><td className="border border-black p-1">{formData.technicianCodeBranch}</td></tr>
                <tr><td className="border border-black p-1">No Laporan</td><td className="border border-black p-1">{formData.reportNumber}</td></tr>
                <tr><td className="border border-black p-1">Nama Customer</td><td className="border border-black p-1">{formData.customerName}</td></tr>
                <tr><td className="border border-black p-1">Alamat</td><td className="border border-black p-1">{formData.address}</td></tr>
                <tr><td className="border border-black p-1">Installation date</td><td className="border border-black p-1">{formData.installationDate}</td></tr>
                <tr><td className="border border-black p-1">Delivery Date</td><td className="border border-black p-1">{formData.deliveryDate}</td></tr>
                <tr><td className="border border-black p-1">End Date</td><td className="border border-black p-1">{formData.endDate}</td></tr>
              </tbody>
            </table>
          </div>

          <table className="w-full border-collapse text-[11px] print-table">
            <thead>
              <tr>
                <th className="border border-black bg-gray-200 p-1 text-center" colSpan={2}>Data Pengukuran</th>
                <th className="border border-black bg-gray-200 p-1 text-center">Satuan</th>
                <th className="border border-black bg-gray-200 p-1 text-center">Referensi</th>
                <th className="border border-black bg-gray-200 p-1 text-center">Data Before ①</th>
                <th className="border border-black bg-gray-200 p-1 text-center">Data After ②</th>
                <th className="border border-black p-0 text-left w-1/4">
                  <div className="bg-gray-200 p-1 font-bold">Faulty Diagnosis / Diagnosa Kerusakan:</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Kelistrikan */}
              <tr>
                <td className="border border-black p-1 text-center align-middle" rowSpan={6}>❶<br/>Kelistrikan /<br/>Electricity</td>
                <td className="border border-black p-1">{measurements[0]?.parameter}</td><td className="border border-black p-1 text-center">{measurements[0]?.unit}</td><td className="border border-black p-1 text-center whitespace-pre-wrap">{measurements[0]?.reference}</td><td className="border border-black p-1 text-center">{measurements[0]?.before}</td><td className="border border-black p-1 text-center font-bold">{measurements[0]?.after}</td>
                <td className="border border-black p-0 align-top" rowSpan={21}>
                  <div className="p-2 min-h-[60px] whitespace-pre-wrap">{formData.diagnosis}</div>
                  <div className="bg-gray-200 p-1 font-bold border-y border-black">Checking result / Hasil Pengecekan :</div>
                  <div className="p-2 min-h-[60px] whitespace-pre-wrap">{formData.checkingResult}</div>
                  <div className="bg-gray-200 p-1 font-bold border-y border-black">Data Pengukuran Spare part Rusak :</div>
                  <div className="p-2 min-h-[60px] whitespace-pre-wrap">{formData.sparePartDamage}</div>
                  <div className="bg-gray-200 p-1 font-bold border-y border-black">Countermeasure / Langkah Perbaikan :</div>
                  <div className="p-2 min-h-[60px] whitespace-pre-wrap">{formData.countermeasure}</div>
                </td>
              </tr>
              {measurements.slice(1, 6).map(m => <tr key={m.id}><td className="border border-black p-1">{m.parameter}</td><td className="border border-black p-1 text-center">{m.unit}</td><td className="border border-black p-1 text-center whitespace-pre-wrap">{m.reference}</td><td className="border border-black p-1 text-center">{m.before}</td><td className="border border-black p-1 text-center font-bold">{m.after}</td></tr>)}
              
              {/* Suhu */}
              <tr>
                <td className="border border-black p-1 text-center align-middle" rowSpan={11}>❷<br/>Suhu /<br/>Temperature</td>
                <td className="border border-black p-1">{measurements[6]?.parameter}</td><td className="border border-black p-1 text-center">{measurements[6]?.unit}</td><td className="border border-black p-1 text-center whitespace-pre-wrap">{measurements[6]?.reference}</td><td className="border border-black p-1 text-center">{measurements[6]?.before}</td><td className="border border-black p-1 text-center font-bold">{measurements[6]?.after}</td>
              </tr>
              {measurements.slice(7, 17).map(m => <tr key={m.id}><td className="border border-black p-1">{m.parameter}</td><td className="border border-black p-1 text-center">{m.unit}</td><td className="border border-black p-1 text-center whitespace-pre-wrap">{m.reference}</td><td className="border border-black p-1 text-center">{m.before}</td><td className="border border-black p-1 text-center font-bold">{m.after}</td></tr>)}
              
              {/* Tekanan */}
              <tr>
                <td className="border border-black p-1 text-center align-middle" rowSpan={4}>❸<br/>Tekanan /<br/>Presure</td>
                <td className="border border-black p-1">{measurements[17]?.parameter}</td><td className="border border-black p-1 text-center">{measurements[17]?.unit}</td><td className="border border-black p-1 text-center whitespace-pre-wrap">{measurements[17]?.reference}</td><td className="border border-black p-1 text-center">{measurements[17]?.before}</td><td className="border border-black p-1 text-center font-bold">{measurements[17]?.after}</td>
              </tr>
              {measurements.slice(18, 21).map(m => <tr key={m.id}><td className="border border-black p-1">{m.parameter}</td><td className="border border-black p-1 text-center">{m.unit}</td><td className="border border-black p-1 text-center whitespace-pre-wrap">{m.reference}</td><td className="border border-black p-1 text-center">{m.before}</td><td className="border border-black p-1 text-center font-bold">{m.after}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
