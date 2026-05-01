import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for a plain, formal, black-and-white report
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  infoTable: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderLeftWidth: 1,
    borderLeftColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  infoLabel: {
    width: '35%',
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  infoValue: {
    width: '65%',
    color: '#000000',
    padding: 5,
  },
  textSection: {
    marginBottom: 20,
  },
  plainText: {
    fontSize: 10,
    color: '#000000',
  },
  measurementTable: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableColHeader: {
    padding: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  tableCol: {
    padding: 6,
    color: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  colParam: { width: '30%' },
  colUnit: { width: '15%', textAlign: 'center' },
  colRef: { width: '20%', textAlign: 'center' },
  colBefore: { width: '15%', textAlign: 'center' },
  colAfter: { width: '20%', textAlign: 'center', borderRightWidth: 0 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 10,
    fontSize: 8,
    color: '#000000',
  }
});

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

interface Props {
  formData: FormData;
  measurements: MeasurementData[];
}

export const ServiceReportPDF: React.FC<Props> = ({ formData, measurements }) => {
  const infoRows = [
    { label: 'Unit (In / Out)', value: `${formData.indoorModel || '-'} / ${formData.outdoorModel || '-'}` },
    { label: 'Serial Number', value: `${formData.indoorSerial || '-'} / ${formData.outdoorSerial || '-'}` },
    { label: 'Customer', value: formData.customerName },
    { label: 'Alamat', value: formData.address || '-' },
    { label: 'Teknisi', value: formData.technicianName || '-' },
    { label: 'Tanggal Pekerjaan', value: new Date(formData.reportDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { label: 'Error Code', value: formData.errorCode || '-' },
    { label: 'Cause of Failure', value: formData.failureCause || '-' },
    { label: 'Mode Operasi', value: formData.operationMode },
    { label: 'Setting Temp', value: `${formData.setTemp || '-'} °C` },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Service Report Detail</Text>
        </View>

        {/* Info Utama */}
        <View style={styles.infoTable}>
          {infoRows.map((row, i) => (
            <View key={i} style={styles.infoRow} wrap={false}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Diagnosa */}
        <View style={styles.textSection} wrap={false}>
          <Text style={styles.sectionTitle}>Diagnosa Kerusakan:</Text>
          <Text style={styles.plainText}>{formData.diagnosis || '-'}</Text>
        </View>

        {/* Hasil Pengecekan */}
        <View style={styles.textSection} wrap={false}>
          <Text style={styles.sectionTitle}>Hasil Pengecekan:</Text>
          <Text style={styles.plainText}>{formData.checkingResult || '-'}</Text>
        </View>

        {/* Tabel Pengukuran */}
        <View style={styles.measurementTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHeader, styles.colParam]}>Data Pengukuran</Text>
            <Text style={[styles.tableColHeader, styles.colUnit]}>Satuan</Text>
            <Text style={[styles.tableColHeader, styles.colRef]}>Referensi</Text>
            <Text style={[styles.tableColHeader, styles.colBefore]}>Data Before</Text>
            <Text style={[styles.tableColHeader, styles.colAfter]}>Data After</Text>
          </View>
          {measurements.map((m, i) => (
            <View key={m.id} style={[styles.tableRow, i === measurements.length - 1 ? styles.tableRowLast : {}]} wrap={false}>
              <Text style={[styles.tableCol, styles.colParam]}>{m.parameter || '-'}</Text>
              <Text style={[styles.tableCol, styles.colUnit]}>{m.unit || '-'}</Text>
              <Text style={[styles.tableCol, styles.colRef]}>{m.reference || '-'}</Text>
              <Text style={[styles.tableCol, styles.colBefore]}>{m.before || '-'}</Text>
              <Text style={[styles.tableCol, styles.colAfter, { fontFamily: 'Helvetica-Bold' }]}>{m.after || '-'}</Text>
            </View>
          ))}
        </View>

        {/* Countermeasure */}
        <View style={styles.textSection} wrap={false}>
          <Text style={styles.sectionTitle}>Countermeasure / Langkah Perbaikan:</Text>
          <Text style={styles.plainText}>{formData.countermeasure || '-'}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated via Service Report App</Text>
          <Text>No Laporan: {formData.reportNumber} | Cetak: {new Date().toLocaleDateString('id-ID')}</Text>
        </View>
      </Page>
    </Document>
  );
};
