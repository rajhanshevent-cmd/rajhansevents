"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/api/supabaseClient';

export default function AutoLogout() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. Check if the user is logged in and is an Admin
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile?.role === 'admin') setIsAdmin(true);
      }
    };

    checkSession();

    // Listen for login/logout events so it instantly updates
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile?.role === 'admin') setIsAdmin(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Global Inactivity Tracker
  useEffect(() => {
    // Only run the timer if the user is actually an admin
    if (!isAdmin) return;

    let inactivityTimer;

    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/admin');
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // 30 minutes of inactivity
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, 1800000);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    // Attach listeners to the whole window
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start timer on mount
    resetTimer();

    // Cleanup when component unmounts or state changes
    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAdmin, router]);

  // This component is completely invisible
  return null; 
}