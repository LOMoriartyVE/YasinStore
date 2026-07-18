'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import styles from '../../auth.module.css';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const code = searchParams.get('code');

    const confirmEmail = async () => {
      if (code) {
        // PKCE Flow: exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus('error');
          setMessage(error.message);
        } else {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        }
      } else {
        // Check if we are already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 2000);
        } else {
          // Wait brief moment in case hash fragment auto-login is running
          setTimeout(async () => {
            const { data: { session: secondCheck } } = await supabase.auth.getSession();
            if (secondCheck) {
              setStatus('success');
              setMessage('Email verified successfully! Redirecting...');
              setTimeout(() => {
                router.push('/login?verified=true');
              }, 2000);
            } else {
              setStatus('error');
              setMessage('Invalid or missing verification link code.');
            }
          }, 1500);
        }
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className={styles.authCard}>
      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <Loader2 size={48} className="spin-animation" style={{ color: 'var(--color-red)' }} />
          <h1 className={styles.authTitle}>Verifying...</h1>
          <p className={styles.authDesc}>{message}</p>
        </div>
      )}
      {status === 'success' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <CheckCircle2 size={48} style={{ color: '#10b981' }} />
          <h1 className={styles.authTitle}>Verified!</h1>
          <p className={styles.authDesc}>{message}</p>
        </div>
      )}
      {status === 'error' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <XCircle size={48} style={{ color: 'var(--color-red)' }} />
          <h1 className={styles.authTitle}>Verification Failed</h1>
          <p className={styles.authDesc}>{message}</p>
          <button className={styles.authBtn} onClick={() => router.push('/login')}>
            Go to Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className={styles.authPage}>
      <Suspense fallback={
        <div className={styles.authCard}>
          <Loader2 size={48} className="spin-animation" style={{ color: 'var(--color-red)', margin: '0 auto' }} />
          <h1 className={styles.authTitle} style={{ marginTop: '16px' }}>Loading Verification...</h1>
        </div>
      }>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
