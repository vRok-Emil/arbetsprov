"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import Link from 'next/link';
import styles from './signup.module.css';

export default function SignupPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validatePassword = (password: string): string | null => {
        if(password.length < 8){
            return "Lösenordet måste vara minst 8 tecken långt";
        }

        if (!/\d/.test(password)) {
      return 'Lösenordet måste innehålla minst en siffra';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Lösenordet måste innehålla minst ett specialtecken';
    }

        return null;
    }

    const handleSubmit = async (e:React.FormEvent) =>{
        e.preventDefault();
        setError("");

        const passwordError = validatePassword(password);
        if (passwordError){
            setError(passwordError);
            return;
        }
        if (password !== confirmPassword){
            setError("Lösenorden matchar inte");
            return;
        }
        setLoading(true);
        try {
            await authAPI.signup(email, password);
        router.push("/login");
        } catch (err: any) {
            setError(err.message || "Ett fel uppstod vid registrering");
        } finally {
            setLoading(false);
        }
    }

    return (
      <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Skapa konto</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="din@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minst 8 tecken, en siffra och specialtecken"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Bekräfta lösenord</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Samma som ovan"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </button>
        </form>

        <p className={styles.link}>
          Har du redan ett konto? <Link href="/login">Logga in</Link>
        </p>
      </div>
    </div>
    )
}