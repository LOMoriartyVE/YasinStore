'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { supabase } from '../../lib/supabase';
import { shortUUID, getPlatformLabel } from '../gamesData';
import { getUserOrders, deleteUserOrder } from '../admin/actions';
import {
  ArrowLeft,
  Loader2,
  LogOut,
  ShoppingBag,
  Trash2,
  User,
} from 'lucide-react';

interface OrderItem {
  product_name: string;
  price: number;
  asia_price: number;
  platform: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  request_items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    document.documentElement.setAttribute('data-theme', savedTheme || 'dark');

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setAuthLoading(false);
      fetchOrders(data.user.id);
    });
  }, [router]);

  const fetchOrders = async (userId?: string) => {
    const uid = userId || user?.id;
    if (!uid) return;
    setOrdersLoading(true);
    const { data, error } = await getUserOrders(uid);

    if (error) {
      console.error('Error fetching orders:', error);
      showToast(`Error: ${error}`);
    } else if (data) {
      setOrders(data as Order[]);
    }
    setOrdersLoading(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!user?.id) return;
    if (!confirm(`Delete order ${shortUUID(orderId)}?`)) return;

    const { success, error } = await deleteUserOrder(user.id, orderId);

    if (!success) {
      showToast(`Failed to delete: ${error || 'Unknown error'}`);
      return;
    }

    showToast(`Order ${shortUUID(orderId)} deleted.`);
    fetchOrders(user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (authLoading) {
    return (
      <div className={styles.loadingScreen}>
        <Loader2 size={32} className="spin-animation" />
        <span className={styles.loadingText}>Loading profile...</span>
      </div>
    );
  }

  const userEmail = user?.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className={styles.profilePage}>
      {/* Header */}
      <header className={`${styles.profileHeader} container`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
            My <span style={{ color: 'var(--color-red)' }}>Profile</span>
          </h1>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your account and track orders</span>
        </div>
        <div className={styles.profileActions}>
          <Link href="/" className={styles.profileBtn}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </header>

      <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* User Info Card */}
        <div className={styles.profileUserCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className={styles.profileAvatar}>{userInitial}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>{userEmail}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className={`${styles.profileBtn} ${styles.profileBtnDanger}`}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Orders Section */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--color-red)' }} /> Your Orders ({orders.length})
          </h2>

          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
              <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 12px' }} />
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)' }}>
              <ShoppingBag size={48} style={{ color: 'var(--color-red)', marginBottom: '16px', opacity: 0.8 }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>No Orders Yet</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
                Browse the catalog, add games to your cart, and checkout. Your orders will appear here.
              </p>
              <Link
                href="/"
                style={{ display: 'inline-block', backgroundColor: 'var(--color-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', textDecoration: 'none' }}
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div key={order.id} className={`${styles.orderCard} ${order.status === 'COMPLETED' ? styles.orderCardCompleted : ''}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-red)' }}>{shortUUID(order.id)}</span>
                      <span style={{
                        padding: '3px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase',
                        backgroundColor: order.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: order.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${order.status === 'COMPLETED' ? '#10b981' : '#f59e0b'}`
                      }}>{order.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          style={{ background: 'none', border: '1px solid rgba(255,46,77,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                          title="Delete Order"
                        >
                          <Trash2 size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                    {(order.request_items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🎮 {item.product_name}
                          <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(255,46,77,0.08)', color: 'var(--text-tertiary)', border: '1px solid rgba(255,46,77,0.15)' }}>{getPlatformLabel(item.platform)}</span>
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.price.toLocaleString()} IQD</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Total</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-red)' }}>{(order.total_amount || 0).toLocaleString()} IQD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#2ecc71', color: '#fff', padding: '16px 24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', fontFamily: 'var(--font-heading)', fontWeight: 600, zIndex: 1000 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
