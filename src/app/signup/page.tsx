'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { supabase } from '../../lib/supabase';
import { Gamepad2, Loader2, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('yasin-store-theme') as 'light' | 'dark' | null;
    document.documentElement.setAttribute('data-theme', savedTheme || 'dark');

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push('/');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
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
        <h1 className={styles.authTitle}>Create Account</h1>
        <p className={styles.authDesc}>Join Yasin Store to get access to exclusive game deals and instant digital delivery.</p>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <CheckCircle2 size={48} style={{ color: '#10b981' }} />
            <div className={styles.authSuccess}>
              Account created! Check your email to confirm, then <Link href="/login" style={{ color: '#10b981', fontWeight: 700 }}>sign in</Link>.
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignup} className={styles.authForm}>
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
                  placeholder="Minimum 6 characters"
                  className={styles.authInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className={styles.authLabel}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  className={styles.authInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && <div className={styles.authError}>{error}</div>}

              <button type="submit" className={styles.authBtn} disabled={loading}>
                {loading ? (
                  <><Loader2 size={18} className="spin-animation" /> Creating Account...</>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className={styles.authLink}>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
