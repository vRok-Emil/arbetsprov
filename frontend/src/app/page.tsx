"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Startsida - redirectar automatiskt till login-sidan
 */
export default function Home() {
  const router = useRouter();

  // useEffect körs vid mount och redirectar till /login
  useEffect(() => {
    router.push('/login');
  }, [router]);

  // Returnera null eftersom användaren redirectas direkt
  return null;
}