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
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [success, setSuccess] = useState(false);

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

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
      },
    });

    if (authError) {
      const msg = authError.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email_exists')) {
        setError('Email is already registered.');
      } else if (msg.includes('password') && msg.includes('weak')) {
        setError('Password must be stronger.');
      } else {
        setError('Something went wrong. Please try again.');
      }
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
          <Gamepad2 size={48} style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(168,85,247,0.1)' }} />
        </div>
        
        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ color: '#10b981' }} />
            <h1 className={styles.authTitle}>Check Your Email</h1>
            <p className={styles.authDesc}>We sent a verification link to your email. Click the link to activate your account, then you can sign in.</p>
            <p className={styles.authLink} style={{ marginTop: '12px' }}>
              <Link href="/login" style={{ color: 'var(--color-purple)', fontWeight: 'bold' }}>Go to Sign In</Link>
            </p>
          </div>
        ) : (
          <>
            <h1 className={styles.authTitle}>Create Account</h1>
            <p className={styles.authDesc}>Join TRT Store to get access to exclusive game deals and instant digital delivery.</p>

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
