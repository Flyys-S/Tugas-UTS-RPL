import { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, Search, Phone, MapPin } from 'lucide-react';
import type { Customer } from '../types';
import { saveCustomer, updateCustomer, deleteCustomer } from '../storage';

interface Props {
  customers: Customer[];
  onRefresh: () => void;
}

export default function CustomerPage({ customers, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await saveCustomer({ id: Date.now().toString(), name: form.name.trim(), address: form.address.trim(), phone: form.phone.trim(), createdAt: new Date().toISOString() });
    setForm({ name: '', address: '', phone: '' });
    setShowAdd(false);
    onRefresh();
  };

  const handleEdit = (c: Customer) => {
    setEditId(c.id);
    setForm({ name: c.name, address: c.address, phone: c.phone });
  };

  const handleSaveEdit = async () => {
    if (!editId || !form.name.trim()) return;
    await updateCustomer({ id: editId, name: form.name.trim(), address: form.address.trim(), phone: form.phone.trim(), createdAt: '' });
    setEditId(null);
    setForm({ name: '', address: '', phone: '' });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus customer ini?')) { await deleteCustomer(id); onRefresh(); }
  };

  const inputCls = "form-input bg-sage-50 dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-800 text-sage-900 dark:text-sage-100 focus:border-sage-500";

  return (
    <section className="form-section">
      {/* Header Card */}
      <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari customer..." className="pl-9 pr-3 py-2 text-sm rounded-lg bg-sage-50 dark:bg-sage-950 border-[1.5px] border-sage-300 dark:border-sage-700 text-sage-900 dark:text-sage-100 focus:border-sage-500 outline-none w-full" />
          </div>
          <button onClick={() => { setShowAdd(true); setEditId(null); setForm({ name: '', address: '', phone: '' }); }} className="btn-generate !text-sm !py-2.5 !px-5 flex items-center gap-2">
            <Plus size={16} /> Tambah Customer
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-500 dark:border-sage-600" style={{ animation: 'fadeUp 0.3s ease' }}>
          <div className="card-header border-b-[1.5px] border-sage-100 dark:border-sage-800">
            <div className="card-icon bg-sage-50 dark:bg-sage-800 border-[1.5px] border-sage-200 dark:border-sage-700">➕</div>
            <div><div className="card-title text-sage-900 dark:text-white">Customer Baru</div><div className="card-desc text-sage-500">Tambah data pelanggan</div></div>
          </div>
          <div className="form-grid col-3">
            <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Nama</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Nama customer" autoFocus /></div>
            <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">Alamat</label><input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={inputCls} placeholder="Alamat" /></div>
            <div className="form-group"><label className="form-label text-sage-700 dark:text-sage-300">No. Telepon</label><input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder="08xx" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="btn-generate !text-sm !py-2 !px-5 flex items-center gap-1"><Check size={15} /> Simpan</button>
            <button onClick={() => setShowAdd(false)} className="btn-back bg-white dark:bg-sage-800 text-sage-700 dark:text-sage-200 border-[1.5px] border-sage-300 dark:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-700 !text-sm !py-2 !px-4">Batal</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="stat-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800">
          <div className="stat-icon bg-sage-50 dark:bg-sage-800">👤</div>
          <div><div className="stat-value text-sage-900 dark:text-white">{customers.length}</div><div className="stat-label">Total Customer</div></div>
        </div>
      </div>

      {/* Customer List */}
      <div className="dash-card bg-white dark:bg-sage-900 border-[1.5px] border-sage-300 dark:border-sage-800 !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="history-table">
            <thead>
              <tr className="bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200">
                <th>No</th><th>Nama</th><th>Alamat</th><th>Telepon</th><th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="history-empty">
                    <div className="history-empty-icon">👤</div>
                    <div className="font-semibold">Belum ada customer</div>
                    <div className="text-sm mt-1">Tambah manual atau otomatis saat buat laporan</div>
                  </div>
                </td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className="border-b border-sage-200 dark:border-sage-800/50 hover:bg-sage-50 dark:hover:bg-sage-800/50">
                  {editId === c.id ? (
                    <>
                      <td className="font-mono text-sage-500 text-sm">{i + 1}</td>
                      <td><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-500 dark:border-sage-600 text-sage-900 dark:text-sage-100" /></td>
                      <td><input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-500 dark:border-sage-600 text-sage-900 dark:text-sage-100" /></td>
                      <td><input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="measure-input bg-white dark:bg-sage-950 border-[1.5px] border-sage-500 dark:border-sage-600 text-sage-900 dark:text-sage-100" /></td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={handleSaveEdit} className="action-icon-btn text-sage-600 hover:text-sage-800 hover:bg-sage-100 dark:hover:bg-sage-800" title="Simpan"><Check size={16} /></button>
                          <button onClick={() => setEditId(null)} className="action-icon-btn text-sage-400 hover:text-sage-600 hover:bg-sage-100 dark:hover:bg-sage-800" title="Batal"><X size={16} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="font-mono text-sage-500 text-sm">{i + 1}</td>
                      <td className="font-semibold">{c.name}</td>
                      <td className="text-sm"><span className="inline-flex items-center gap-1 text-sage-600 dark:text-sage-400"><MapPin size={13} /> {c.address || '-'}</span></td>
                      <td className="text-sm"><span className="inline-flex items-center gap-1 text-sage-600 dark:text-sage-400"><Phone size={13} /> {c.phone || '-'}</span></td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleEdit(c)} className="action-icon-btn text-sage-500 hover:text-sage-700 hover:bg-sage-100 dark:hover:bg-sage-800" title="Edit"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(c.id)} className="action-icon-btn text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 text-xs text-sage-500 border-t border-sage-200 dark:border-sage-800">
            Menampilkan {filtered.length} dari {customers.length} customer
          </div>
        )}
      </div>
    </section>
  );
}
