import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Constants for color palette
const SAGE_900 = '#23352c';
const SAGE_700 = '#3a5a40';
const SAGE_500 = '#588157';
const SAGE_300 = '#a3b18a';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: SAGE_300,
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: SAGE_900,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: SAGE_900,
    marginBottom: 5,
  },
  infoTable: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 5,
  },
  infoLabel: {
    width: '35%',
    fontFamily: 'Helvetica-Bold',
    color: SAGE_900,
  },
  infoValue: {
    width: '65%',
    color: '#333333',
  },
  box: {
    backgroundColor: '#f5f7f5',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: SAGE_300,
    marginBottom: 20,
  },
  boxText: {
    fontSize: 10,
  },
  measurementTable: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: SAGE_300,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: SAGE_700,
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: SAGE_300,
  },
  tableRowEven: {
    backgroundColor: '#f9faf9',
  },
  tableColHeader: {
    padding: 6,
    fontFamily: 'Helvetica-Bold',
  },
  tableCol: {
    padding: 6,
  },
  colParam: { width: '30%' },
  colUnit: { width: '15%', textAlign: 'center' },
  colRef: { width: '20%', textAlign: 'center' },
  colBefore: { width: '15%', textAlign: 'center' },
  colAfter: { width: '20%', textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: SAGE_300,
    paddingTop: 10,
    fontSize: 8,
    color: '#666666',
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
        <View style={styles.box} wrap={false}>
          <Text style={styles.sectionTitle}>Diagnosa Kerusakan:</Text>
          <Text style={styles.boxText}>{formData.diagnosis || '-'}</Text>
        </View>

        {/* Hasil Pengecekan */}
        <View style={styles.box} wrap={false}>
          <Text style={styles.sectionTitle}>Hasil Pengecekan:</Text>
          <Text style={styles.boxText}>{formData.checkingResult || '-'}</Text>
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
            <View key={m.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]} wrap={false}>
              <Text style={[styles.tableCol, styles.colParam]}>{m.parameter || '-'}</Text>
              <Text style={[styles.tableCol, styles.colUnit]}>{m.unit || '-'}</Text>
              <Text style={[styles.tableCol, styles.colRef]}>{m.reference || '-'}</Text>
              <Text style={[styles.tableCol, styles.colBefore]}>{m.before || '-'}</Text>
              <Text style={[styles.tableCol, styles.colAfter, { fontFamily: 'Helvetica-Bold' }]}>{m.after || '-'}</Text>
            </View>
          ))}
        </View>

        {/* Countermeasure */}
        <View style={[styles.box, { backgroundColor: '#eef2ee', borderColor: SAGE_500 }]} wrap={false}>
          <Text style={styles.sectionTitle}>Countermeasure / Langkah Perbaikan:</Text>
          <Text style={styles.boxText}>{formData.countermeasure || '-'}</Text>
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
