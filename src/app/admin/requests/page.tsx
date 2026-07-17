'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
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

interface GameOrderItem {
  id: string;
  title: string;
  price: number;
}

interface GameRequest {
  id: string;
  games: GameOrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Completed';
  createdAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [toastMessage, setToastMessage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Password Lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Load requests, theme, and authentication
  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const savedRequests = localStorage.getItem('yasin-store-requests');
    if (savedRequests) {
      try {
        setRequests(JSON.parse(savedRequests));
      } catch (e) {
        console.error('Failed to parse requests list', e);
      }
    }

    // Check authentication state
    const isAuthed = sessionStorage.getItem('yasin-store-admin-authed');
    if (isAuthed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = 'Rt92Lm#847pqX5@9012Zk';

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('yasin-store-admin-authed', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const toggleStatus = (id: string) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        const nextStatus: 'Pending' | 'Completed' = req.status === 'Pending' ? 'Completed' : 'Pending';
        showToast(`Request ${id} marked as ${nextStatus}`);
        return { ...req, status: nextStatus };
      }
      return req;
    });
    setRequests(updated);
    localStorage.setItem('yasin-store-requests', JSON.stringify(updated));
  };

  const handleDeleteRequest = (id: string) => {
    if (!confirm(`Are you sure you want to delete Request ${id}?`)) {
      return;
    }
    const updated = requests.filter(req => req.id !== id);
    setRequests(updated);
    localStorage.setItem('yasin-store-requests', JSON.stringify(updated));
    showToast(`Request ${id} deleted.`);
  };

  const clearAllCompleted = () => {
    if (!confirm('Are you sure you want to clear all completed requests?')) {
      return;
    }
    const updated = requests.filter(req => req.status !== 'Completed');
    setRequests(updated);
    localStorage.setItem('yasin-store-requests', JSON.stringify(updated));
    showToast('Cleared completed requests.');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'Pending') return req.status === 'Pending';
    if (filter === 'Completed') return req.status === 'Completed';
    return true;
  });

  const totalPending = requests.filter(req => req.status === 'Pending').length;
  const totalCompleted = requests.filter(req => req.status === 'Completed').length;
  const totalSumPending = requests
    .filter(req => req.status === 'Pending')
    .reduce((sum, r) => sum + r.totalPrice, 0);

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
            <input 
              type="password" 
              placeholder="Enter Password" 
              className={styles.input}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
            {loginError && (
              <span className={styles.lockError}>Invalid key password. Access Denied.</span>
            )}
            <button type="submit" className={styles.submitBtn}>
              Grant Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      {/* Admin Header */}
      <header className={`${styles.header} container`}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            USER <span className={styles.titleRed}>REQUESTS</span>
          </h1>
          <span className={styles.subtitle}>Verify manual payments and deliver client game keys</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin" className={styles.backBtn}>
            Product Dashboard
          </Link>
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </header>

      {/* Main Console */}
      <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Status Dashboard Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Total Requests</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>{requests.length}</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#f59e0b" /> Pending Verification
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '8px' }}>{totalPending}</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10b981" /> Completed Orders
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '8px' }}>{totalCompleted}</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Pending Volume</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>{totalSumPending.toLocaleString()} IQD</div>
          </div>
        </div>

        {/* Requests Management Panel */}
        <section className={styles.panelCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 className={styles.panelTitle} style={{ margin: 0 }}>
              <Database size={20} className={styles.titleRed} /> Purchase Requests list
            </h2>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['All', 'Pending', 'Completed'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: filter === t ? 'var(--color-red)' : 'var(--bg-secondary)',
                    color: filter === t ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t}
                </button>
              ))}
              {totalCompleted > 0 && (
                <button
                  onClick={clearAllCompleted}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 46, 77, 0.2)',
                    backgroundColor: 'rgba(255, 46, 77, 0.05)',
                    color: 'var(--color-red)',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>

          {/* List of Requests */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                <AlertTriangle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3>No requests found</h3>
                <p style={{ fontSize: '0.9rem' }}>When users click checkout, their order logs will appear here.</p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div 
                  key={req.id} 
                  style={{ 
                    padding: '20px', 
                    backgroundColor: 'var(--bg-primary)', 
                    border: `1px solid ${req.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)'}`, 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Item Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{req.id}</span>
                        <span 
                          style={{ 
                            padding: '4px 8px', 
                            borderRadius: '50px', 
                            fontSize: '0.7rem', 
                            fontWeight: 'bold', 
                            textTransform: 'uppercase',
                            backgroundColor: req.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: req.status === 'Completed' ? '#10b981' : '#f59e0b',
                            border: `1px solid ${req.status === 'Completed' ? '#10b981' : '#f59e0b'}`
                          }}
                        >
                          {req.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>Submitted: {req.createdAt}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => toggleStatus(req.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${req.status === 'Completed' ? 'var(--border-color)' : 'rgba(16, 185, 129, 0.3)'}`,
                          backgroundColor: req.status === 'Completed' ? 'var(--bg-secondary)' : 'rgba(16, 185, 129, 0.05)',
                          color: req.status === 'Completed' ? 'var(--text-secondary)' : '#10b981',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {req.status === 'Completed' ? 'Revert to Pending' : 'Mark Completed'}
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        style={{
                          padding: '6px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(255, 46, 77, 0.2)',
                          backgroundColor: 'rgba(255, 46, 77, 0.05)',
                          color: 'var(--color-red)',
                          cursor: 'pointer'
                        }}
                        title="Delete Request"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Games ordered */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border-color)', borderBottom: '1px dashed var(--border-color)', padding: '12px 0' }}>
                    {req.games.map((game, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ArrowUpRight size={14} style={{ opacity: 0.6 }} /> {game.title}
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{game.price.toLocaleString()} IQD</span>
                      </div>
                    ))}
                  </div>

                  {/* Total summary row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Total Bill Amount:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-red)' }}>{req.totalPrice.toLocaleString()} IQD</span>
                  </div>

                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Success Toast */}
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle size={18} /> {toastMessage}
        </div>
      )}
    </div>
  );
}
