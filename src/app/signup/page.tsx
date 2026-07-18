'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { supabase } from '../../lib/supabase';
import { Gamepad2, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  
  const [showOtp, setShowOtp] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

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

    setShowOtp(true);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: otpError } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'signup',
    });

    if (otpError) {
      const msg = otpError.message.toLowerCase();
      if (msg.includes('invalid') || msg.includes('expired') || msg.includes('incorrect') || msg.includes('token')) {
        setError('Incorrect or expired verification code.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
      return;
    }

    setVerifiedSuccess(true);
    setLoading(false);
    
    // Automatically redirect to login page after 3 seconds
    setTimeout(() => {
      router.push('/login?verified=true');
    }, 3000);
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
          {showOtp ? (
            <ShieldCheck size={48} style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(255,46,77,0.1)' }} />
          ) : (
            <Gamepad2 size={48} style={{ borderRadius: '50%', padding: '10px', backgroundColor: 'rgba(255,46,77,0.1)' }} />
          )}
        </div>
        
        {verifiedSuccess ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ color: '#10b981' }} />
            <h1 className={styles.authTitle}>Email Verified!</h1>
            <p className={styles.authDesc}>Your email has been successfully verified. Redirecting you to the sign-in page...</p>
          </div>
        ) : showOtp ? (
          <>
            <h1 className={styles.authTitle}>Enter Verification Code</h1>
            <p className={styles.authDesc}>We sent a 6-digit confirmation code to <strong>{email}</strong>. Enter it below to verify your account.</p>

            <form onSubmit={handleVerifyOtp} className={styles.authForm}>
              <div>
                <label className={styles.authLabel}>6-Digit Code</label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className={styles.authInput}
                  style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  required
                  disabled={loading}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '8px', display: 'block', textAlign: 'center' }}>
                  The code is valid for 10 minutes.
                </span>
              </div>

              {error && <div className={styles.authError}>{error}</div>}

              <button type="submit" className={styles.authBtn} disabled={loading}>
                {loading ? (
                  <><Loader2 size={18} className="spin-animation" /> Verifying...</>
                ) : (
                  'Confirm Verification'
                )}
              </button>
            </form>

            <p className={styles.authLink}>
              Wrong email address? <a href="#" onClick={(e) => { e.preventDefault(); setShowOtp(false); }}>Go back</a>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.authTitle}>Create Account</h1>
            <p className={styles.authDesc}>Join Yasin Store to get access to exclusive game deals and instant digital delivery.</p>

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
