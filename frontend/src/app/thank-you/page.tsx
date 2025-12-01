

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './thank-you.module.css';

export default function ThankYouPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Tack för att du loggade in!</h1>
        <p className={styles.welcome}>Välkommen, {user?.email}!</p>
        
        <button 
          onClick={logout}
          className={styles.button}
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}