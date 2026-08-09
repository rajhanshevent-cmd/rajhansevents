"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';
import { supabase } from '@/app/api/supabaseClient';

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
      router.push('/');
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
        <div>
          <h2>You are already logged in as Admin</h2>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
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
        </>
      )}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}