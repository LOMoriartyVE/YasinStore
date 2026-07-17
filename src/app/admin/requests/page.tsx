'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { supabase } from '../../../lib/supabase';
import { 
  ArrowLeft, 
  Trash2, 
  CheckCircle,
  Database,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface RequestItem {
  product_name: string;
  price: number;
}

interface GameRequest {
  id: string;
  created_at: string;
  status: string;
  total_amounr: number;
  items: RequestItem[];
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [filter, setFilter] = useState<'All' | 'PENDING' | 'COMPLETED'>('All');
  const [toastMessage, setToastMessage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const isAuthed = sessionStorage.getItem('yasin-store-admin-authed');
    if (isAuthed === 'true') setIsAuthenticated(true);

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data: reqData, error: reqErr } = await supabase
      .from('Requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (reqErr || !reqData) {
      console.error('Error fetching requests:', reqErr);
      return;
    }

    const { data: itemsData, error: itemsErr } = await supabase
      .from('request_items')
      .select('*');

    if (itemsErr) console.error('Error fetching items:', itemsErr);

    const itemsByReq: Record<string, RequestItem[]> = {};
    (itemsData || []).forEach((item: any) => {
      if (!itemsByReq[item.request_id]) itemsByReq[item.request_id] = [];
      itemsByReq[item.request_id].push({ product_name: item.product_name, price: item.price });
    });

    setRequests(reqData.map((r: any) => ({
      ...r,
      items: itemsByReq[r.id] || []
    })));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Rt92Lm#847pqX5@9012Zk') {
      setIsAuthenticated(true);
      sessionStorage.setItem('yasin-store-admin-authed', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'PENDING' ? 'COMPLETED' : 'PENDING';
    const { error } = await supabase.from('Requests').update({ status: next }).eq('id', id);
    if (error) { showToast(`Failed: ${error.message}`); return; }
    showToast(`Request ${id} → ${next}`);
    fetchRequests();
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(`Delete request ${id}?`)) return;
    await supabase.from('request_items').delete().eq('request_id', id);
    const { error } = await supabase.from('Requests').delete().eq('id', id);
    if (error) { showToast(`Failed: ${error.message}`); return; }
    showToast(`${id} deleted.`);
    fetchRequests();
  };

  const clearAllCompleted = async () => {
    if (!confirm('Clear all completed requests?')) return;
    const completedIds = requests.filter(r => r.status === 'COMPLETED').map(r => r.id);
    for (const id of completedIds) {
      await supabase.from('request_items').delete().eq('request_id', id);
      await supabase.from('Requests').delete().eq('id', id);
    }
    showToast('Cleared completed.');
    fetchRequests();
  };

  const filtered = requests.filter(r => filter === 'All' ? true : r.status === filter);
  const totalPending = requests.filter(r => r.status === 'PENDING').length;
  const totalCompleted = requests.filter(r => r.status === 'COMPLETED').length;
  const pendingVolume = requests.filter(r => r.status === 'PENDING').reduce((s, r) => s + (r.total_amounr || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className={styles.lockScreen}>
        <div className={styles.lockCard}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-red)' }}>
            <Lock size={48} className="red-glow-effect" style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(255,46,77,0.1)' }} />
          </div>
          <h1 className={styles.lockTitle}>Admin Access</h1>
          <p className={styles.lockDesc}>Enter the cryptographic console key to access the Yasin Store catalog database.</p>
          <form onSubmit={handlePasswordSubmit} className={styles.lockForm}>
            <input type="password" placeholder="Enter Password" className={styles.input} value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required />
            {loginError && <span className={styles.lockError}>Invalid key password. Access Denied.</span>}
            <button type="submit" className={styles.submitBtn}>Grant Access</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <header className={`${styles.header} container`}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>USER <span className={styles.titleRed}>REQUESTS</span></h1>
          <span className={styles.subtitle}>Verify manual payments and deliver client game keys</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin" className={styles.backBtn}>Product Dashboard</Link>
          <Link href="/" className={styles.backBtn}><ArrowLeft size={16} /> Back to Store</Link>
        </div>
      </header>

      <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Total</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>{requests.length}</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#f59e0b" /> Pending</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '8px' }}>{totalPending}</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#10b981" /> Completed</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '8px' }}>{totalCompleted}</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Pending Volume</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>{pendingVolume.toLocaleString()} IQD</div>
          </div>
        </div>

        <section className={styles.panelCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 className={styles.panelTitle} style={{ margin: 0 }}><Database size={20} className={styles.titleRed} /> Purchase Requests</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['All', 'PENDING', 'COMPLETED'] as const).map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: filter === t ? 'var(--color-red)' : 'var(--bg-secondary)', color: filter === t ? '#fff' : 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>{t === 'All' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}</button>
              ))}
              {totalCompleted > 0 && (
                <button onClick={clearAllCompleted} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,46,77,0.2)', backgroundColor: 'rgba(255,46,77,0.05)', color: 'var(--color-red)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>Clear Completed</button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                <AlertTriangle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3>No requests found</h3>
                <p style={{ fontSize: '0.9rem' }}>When users checkout, their orders appear here.</p>
              </div>
            ) : filtered.map(req => (
              <div key={req.id} style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', border: `1px solid ${req.status === 'COMPLETED' ? 'rgba(16,185,129,0.2)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{req.id}</span>
                      <span style={{ padding: '4px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: req.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: req.status === 'COMPLETED' ? '#10b981' : '#f59e0b', border: `1px solid ${req.status === 'COMPLETED' ? '#10b981' : '#f59e0b'}` }}>{req.status}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>Submitted: {new Date(req.created_at).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => toggleStatus(req.id, req.status)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${req.status === 'COMPLETED' ? 'var(--border-color)' : 'rgba(16,185,129,0.3)'}`, backgroundColor: req.status === 'COMPLETED' ? 'var(--bg-secondary)' : 'rgba(16,185,129,0.05)', color: req.status === 'COMPLETED' ? 'var(--text-secondary)' : '#10b981', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>{req.status === 'COMPLETED' ? 'Revert to Pending' : 'Mark Completed'}</button>
                    <button onClick={() => handleDeleteRequest(req.id)} style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,46,77,0.2)', backgroundColor: 'rgba(255,46,77,0.05)', color: 'var(--color-red)', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border-color)', borderBottom: '1px dashed var(--border-color)', padding: '12px 0' }}>
                  {req.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowUpRight size={14} style={{ opacity: 0.6 }} /> {item.product_name}</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.price.toLocaleString()} IQD</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Total:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-red)' }}>{(req.total_amounr || 0).toLocaleString()} IQD</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {toastMessage && (
        <div className={styles.toast}><CheckCircle size={18} /> {toastMessage}</div>
      )}
    </div>
  );
}
