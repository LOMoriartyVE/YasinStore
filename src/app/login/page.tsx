'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { supabase } from '../../lib/supabase';
import { Gamepad2, Loader2, CheckCircle2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    document.documentElement.setAttribute('data-theme', savedTheme || 'dark');

    if (searchParams.get('verified') === 'true') {
      setSuccess('Your email has been verified! You can now sign in.');
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push('/');
      } else {
        setChecking(false);
      }
    });
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/');
  };

  if (checking) {
    return (
      <div className={styles.loadingScreen}>
        <Loader2 size={32} className="spin-animation" />
        <span className={styles.loadingText}>Loading...</span>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authIcon}>
          <Gamepad2 size={48} style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(255,46,77,0.1)' }} />
        </div>
        <h1 className={styles.authTitle}>Welcome Back</h1>
        <p className={styles.authDesc}>Sign in to your Yasin Store account to browse, purchase, and track your orders.</p>

        {success && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }} className={styles.authSuccess}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.authForm}>
          <div>
            <label className={styles.authLabel}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={styles.authInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className={styles.authLabel}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={styles.authInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className={styles.authError}>{error}</div>}

          <button type="submit" className={styles.authBtn} disabled={loading}>
            {loading ? (
              <><Loader2 size={18} className="spin-animation" /> Signing In...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className={styles.authLink}>
          Don&apos;t have an account? <Link href="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingScreen}>
        <Loader2 size={32} className="spin-animation" />
        <span className={styles.loadingText}>Loading Login Page...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
