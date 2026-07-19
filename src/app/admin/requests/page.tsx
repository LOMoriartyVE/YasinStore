'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { getPlatformLabel, shortUUID } from '../../gamesData';
import {
  getRequests,
  updateRequestStatus,
  deleteRequest,
  clearCompletedRequests,
  verifyAdminPassword,
} from '../actions';
import { 
  ArrowLeft, 
  Trash2, 
  CheckCircle,
  Database,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  Copy,
} from 'lucide-react';

interface RequestItem {
  product_name: string;
  price: number;
  asia_price: number;
  platform: number;
}

interface GameRequest {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
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
  const [loginLoading, setLoginLoading] = useState(false);

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
    const { data, error } = await getRequests();
    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }
    setRequests(data);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(false);

    const { success } = await verifyAdminPassword(passwordInput);

    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('yasin-store-admin-authed', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
    setLoginLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'PENDING' ? 'COMPLETED' : 'PENDING';
    const { success, error } = await updateRequestStatus(id, next);
    if (!success) { showToast(`Failed: ${error}`); return; }
    showToast(`Request ${shortUUID(id)} → ${next}`);
    fetchRequests();
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(`Delete request ${shortUUID(id)}?`)) return;
    const { success, error } = await deleteRequest(id);
    if (!success) { showToast(`Failed: ${error}`); return; }
    showToast(`${shortUUID(id)} deleted.`);
    fetchRequests();
  };

  const handleClearAllCompleted = async () => {
    if (!confirm('Clear all completed requests?')) return;
    const { success, error } = await clearCompletedRequests();
    if (!success) { showToast(`Failed: ${error}`); return; }
    showToast('Cleared completed.');
    fetchRequests();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Full UUID copied to clipboard');
  };

  const filtered = requests.filter(r => filter === 'All' ? true : r.status === filter);
  const totalPending = requests.filter(r => r.status === 'PENDING').length;
  const totalCompleted = requests.filter(r => r.status === 'COMPLETED').length;
  const pendingVolume = requests.filter(r => r.status === 'PENDING').reduce((s, r) => s + (r.total_amount || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className={styles.lockScreen}>
        <div className={styles.lockCard}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-purple)' }}>
            <Lock size={48} className="purple-glow-effect" style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(168,85,247,0.1)' }} />
          </div>
          <h1 className={styles.lockTitle}>Admin Access</h1>
          <p className={styles.lockDesc}>Enter the cryptographic console key to access the TRT STORE catalog database.</p>
          <form onSubmit={handlePasswordSubmit} className={styles.lockForm}>
            <input type="password" placeholder="Enter Password" className={styles.input} value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required disabled={loginLoading} />
            {loginError && <span className={styles.lockError}>Invalid key password. Access Denied.</span>}
            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
              {loginLoading ? (<><Loader2 size={18} className="spin-animation" /> Verifying...</>) : 'Grant Access'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <header className={`${styles.header} container`}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>USER <span className={styles.titlePurple}>REQUESTS</span></h1>
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
            <h2 className={styles.panelTitle} style={{ margin: 0 }}><Database size={20} className={styles.titlePurple} /> Purchase Requests</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['All', 'PENDING', 'COMPLETED'] as const).map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: filter === t ? 'var(--color-purple)' : 'var(--bg-secondary)', color: filter === t ? '#fff' : 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>{t === 'All' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}</button>
              ))}
              {totalCompleted > 0 && (
                <button onClick={handleClearAllCompleted} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(168,85,247,0.2)', backgroundColor: 'rgba(168,85,247,0.05)', color: 'var(--color-purple)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>Clear Completed</button>
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
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{shortUUID(req.id)}</span>
                      <button
                        onClick={() => copyToClipboard(req.id)}
                        title={`Full ID: ${req.id}`}
                        style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Copy size={14} />
                      </button>
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
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowUpRight size={14} style={{ opacity: 0.6 }} /> {item.product_name}
                        <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(168,85,247,0.08)', color: 'var(--text-tertiary)', border: '1px solid rgba(168,85,247,0.15)' }}>{getPlatformLabel(item.platform)}</span>
                      </span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.price.toLocaleString()} IQD</span>
                        {item.asia_price > 0 && (
                          <span style={{ fontWeight: '500', color: '#f59e0b', fontSize: '0.8rem' }}>Asia: {item.asia_price.toLocaleString()} IQD</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Total:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-purple)' }}>{(req.total_amount || 0).toLocaleString()} IQD</span>
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
