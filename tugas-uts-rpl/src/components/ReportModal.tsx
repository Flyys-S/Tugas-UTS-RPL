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
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>body{font-family:'Outfit',sans-serif;padding:40px;color:#1a1a1a;font-size:14px;}
      table{width:100%;border-collapse:collapse;margin-bottom:20px;}
      .info td{padding:8px 12px;border:1px solid #dde5da;font-size:13px;}
      .info tr:nth-child(odd) td{background:#f4f7f2;}
      .key{font-weight:600;color:#4a6a50;width:28%;}
      .sec{font-size:12px;font-weight:700;text-transform:uppercase;color:#3a5a40;background:#edf1eb;border-left:4px solid #588157;padding:7px 12px;margin:18px 0 8px;border-radius:0 6px 6px 0;}
      .block{background:#f8faf7;border:1px solid #dde5da;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.7;white-space:pre-wrap;margin-bottom:4px;}
      .success{background:#f0faf4;border:1px solid #a8ddb8;border-left:4px solid #27ae60;}
      .mt th{background:#3a5a40;color:white;padding:8px 12px;text-align:left;font-size:12px;}
      .mt td{padding:7px 12px;border-bottom:1px solid #dde5da;font-family:'DM Mono',monospace;font-size:12px;}
      .mt tr:nth-child(even) td{background:#f4f7f2;}
      </style></head><body>
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #588157;padding-bottom:16px;margin-bottom:24px;">
        <div><div style="font-size:22px;font-weight:800;color:#3a5a40;">Mitra Maju Sejati</div><div style="font-size:12px;color:#888;">Service & Maintenance AC Profesional</div></div>
        <div style="background:#588157;color:white;font-size:22px;font-weight:800;padding:8px 16px;border-radius:10px;">MMS</div>
      </div>
      <div style="text-align:center;font-size:17px;font-weight:700;margin-bottom:20px;">SERVICE REPORT DETAIL</div>
      <table class="info"><tbody>
        <tr><td class="key">Unit (In/Out)</td><td>${formData.indoorModel||'-'} / ${formData.outdoorModel||'-'}</td><td class="key">Serial Number</td><td>${formData.indoorSerial||'-'} / ${formData.outdoorSerial||'-'}</td></tr>
        <tr><td class="key">Customer</td><td>${formData.customerName}</td><td class="key">Alamat</td><td>${formData.address||'-'}</td></tr>
        <tr><td class="key">Teknisi</td><td>${formData.technicianName||'-'}</td><td class="key">No Laporan</td><td>${formData.reportNumber}</td></tr>
        <tr><td class="key">Error Code</td><td>${formData.errorCode||'-'}</td><td class="key">Mode</td><td>${formData.operationMode} / ${formData.setTemp||'-'}°C</td></tr>
        <tr><td class="key">Cause of Failure</td><td colspan="3">${formData.failureCause||'-'}</td></tr>
      </tbody></table>
      <div class="sec">Diagnosa Kerusakan</div><div class="block">${formData.diagnosis||'-'}</div>
      <div class="sec">Hasil Pengecekan</div><div class="block">${formData.checkingResult||'-'}</div>
      <div class="sec">Data Pengukuran</div>
      <table class="mt"><thead><tr><th>Parameter</th><th>Satuan</th><th>Referensi</th><th>Before</th><th>After</th></tr></thead>
      <tbody>${measurements.map(m=>`<tr><td style="font-family:'Outfit'">${m.parameter||'-'}</td><td>${m.unit||'-'}</td><td>${m.reference||'-'}</td><td>${m.before||'-'}</td><td style="font-weight:600">${m.after||'-'}</td></tr>`).join('')}</tbody></table>
      <div class="sec">Countermeasure</div><div class="block success">${formData.countermeasure||'-'}</div>
      <div style="margin-top:28px;padding-top:12px;border-top:1.5px solid #dde5da;font-size:11px;color:#888;display:flex;justify-content:space-between;font-family:'DM Mono',monospace;">
        <span>No. Laporan: ${formData.reportNumber}</span><span>MMS — Service Report</span><span>Dicetak: ${new Date().toLocaleDateString('id-ID')}</span>
      </div></body></html>`;
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
            <h3 className="font-bold text-sage-900 dark:text-white">📄 Detail Laporan</h3>
            <p className="text-xs text-sage-500">No. {formData.reportNumber} — {new Date(report.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn-download flex items-center gap-2 text-sm !py-2 !px-3"><Download size={15}/> PDF</button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-800 text-sage-500"><X size={18}/></button>
          </div>
        </div>

        {/* Report Content */}
        <div className="report-paper !rounded-t-none border-t-0">
          <div className="rpt-letterhead">
            <div><div className="rpt-company-name">Mitra Maju Sejati</div><div className="rpt-company-sub">Service & Maintenance AC Profesional</div></div>
            <div className="rpt-badge">MMS</div>
          </div>
          <div className="rpt-title">SERVICE REPORT DETAIL</div>
          <table className="rpt-info-table"><tbody>
            <tr><td className="rpt-key">Unit (In/Out)</td><td>{formData.indoorModel||'-'} / {formData.outdoorModel||'-'}</td><td className="rpt-key">Serial Number</td><td>{formData.indoorSerial||'-'} / {formData.outdoorSerial||'-'}</td></tr>
            <tr><td className="rpt-key">Customer</td><td>{formData.customerName}</td><td className="rpt-key">Alamat</td><td>{formData.address||'-'}</td></tr>
            <tr><td className="rpt-key">Teknisi</td><td>{formData.technicianName||'-'}</td><td className="rpt-key">No Laporan</td><td>{formData.reportNumber}</td></tr>
            <tr><td className="rpt-key">Error Code</td><td>{formData.errorCode||'-'}</td><td className="rpt-key">Mode</td><td>{formData.operationMode} / {formData.setTemp||'-'}°C</td></tr>
            <tr><td className="rpt-key">Cause of Failure</td><td colSpan={3}>{formData.failureCause||'-'}</td></tr>
          </tbody></table>
          <div className="rpt-section-label">Diagnosa Kerusakan</div>
          <div className="rpt-block">{formData.diagnosis||'-'}</div>
          <div className="rpt-section-label">Hasil Pengecekan</div>
          <div className="rpt-block">{formData.checkingResult||'-'}</div>
          <div className="rpt-section-label">Data Pengukuran</div>
          <table className="rpt-measure-table"><thead><tr><th>Parameter</th><th>Satuan</th><th>Referensi</th><th>Before</th><th>After</th></tr></thead>
            <tbody>{measurements.map(m=>(
              <tr key={m.id}><td style={{fontFamily:'var(--font-body)'}}>{m.parameter||'-'}</td><td>{m.unit||'-'}</td><td>{m.reference||'-'}</td><td>{m.before||'-'}</td><td style={{fontWeight:600}}>{m.after||'-'}</td></tr>
            ))}</tbody>
          </table>
          <div className="rpt-section-label">Countermeasure</div>
          <div className="rpt-block-success">{formData.countermeasure||'-'}</div>
          <div className="rpt-footer">
            <span>No. Laporan: {formData.reportNumber}</span>
            <span>MMS — Service Report</span>
            <span>{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
