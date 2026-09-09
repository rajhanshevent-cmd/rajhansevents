"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';
import { supabase } from '@/utils/supabaseClient';

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_COOLDOWN_MS = 5 * 60 * 1000;

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile?.role === 'admin') setIsAdmin(true);
      }
      setChecking(false);
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    window.location.reload(); // Refresh to update Navbar state
  };

  const verifyAdminRole = async (userId) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role === 'admin') {
      setFailedAttempts(0);
      setLockedUntil(null);
      router.push('/Manage');
    } else {
      await supabase.auth.signOut();
      setError('Invalid credentials');
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= MAX_LOGIN_ATTEMPTS) {
          setLockedUntil(Date.now() + LOGIN_COOLDOWN_MS);
        }
        return next;
      });
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) {
      setError('Too many attempts. Please wait before retrying.');
      return;
    }

    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Invalid credentials');
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= MAX_LOGIN_ATTEMPTS) {
          setLockedUntil(Date.now() + LOGIN_COOLDOWN_MS);
        }
        return next;
      });
    } else {
      await verifyAdminRole(data.user.id);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (lockedUntil && Date.now() < lockedUntil) {
      setError('Too many attempts. Please wait before retrying.');
      return;
    }

    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError('Authentication failed');
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= MAX_LOGIN_ATTEMPTS) {
          setLockedUntil(Date.now() + LOGIN_COOLDOWN_MS);
        }
        return next;
      });
      setLoading(false);
    }
  };

  if (checking) return <div>Loading...</div>;

  return (
    <div className="admin-login-container">
      {isAdmin ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <h2>You are logged in as Admin</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => router.push('/Manage')} style={{ padding: '10px 20px', background: '#DAA520', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
              Go to Dashboard
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      ) : (
        <>
          <h2>Admin Access Only</h2>
          <form onSubmit={handleEmailLogin}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Authenticating...' : 'Login'}</button>
          </form>

          <div className="divider">OR</div>

          <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
            Login with Google
          </button>

          <div style={{
            marginTop: '2rem',
            padding: '1.2rem',
            background: 'linear-gradient(135deg, rgba(123, 26, 40, 0.1), rgba(212, 175, 55, 0.15))',
            border: '1.5px solid #D4AF37',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <span style={{
              display: 'inline-block',
              background: '#7b1a28',
              color: '#D4AF37',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              padding: '3px 10px',
              borderRadius: '20px',
              marginBottom: '8px'
            }}>
              DEV PREVIEW UNLOCKED
            </span>
            <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#444' }}>
              Preview mode is active. You can enter the dashboard immediately without login.
            </p>
            <button
              type="button"
              onClick={() => router.push('/Manage')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7b1a28, #5c1328)',
                color: '#D4AF37',
                border: '1px solid #D4AF37',
                padding: '10px 16px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Directly Enter Admin Dashboard &rarr;
            </button>
          </div>
        </>
      )}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}