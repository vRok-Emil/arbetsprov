"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import Link from 'next/link';
import styles from './signup.module.css';
//sign up sida. Låter användaren skapa ett konto med email och lösenord
export default function SignupPage(){
  //state för email, lösenord, bekräfta lösenord, error meddelande och loading status
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    //valideringsfunktion för lösenord som kollar längd, siffra och specialtecken
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

        return null; //inget error = lösenord är giltigt.
    }
    //hantera formulär inskickning för att skapa konto
    const handleSubmit = async (e:React.FormEvent) =>{
        e.preventDefault(); //förhindra default formulär beteende
        setError(""); //resna tidgaere error meddelande

        //validera lösenord
        const passwordError = validatePassword(password);
        if (passwordError){
            setError(passwordError);
            return;
        }
        //kolla om lösenord och bekräfta lösenord matchar
        if (password !== confirmPassword){
            setError("Lösenorden matchar inte");
            return;
        }
        setLoading(true); //sätt loading state
        try {
          //anropar signup API med email och lösenord
            await authAPI.signup(email, password);
        router.push("/login");
        } catch (err: any) {
          //om något går fel, sätt error meddelande
            setError(err.message || "Ett fel uppstod vid registrering");
        } finally {
            setLoading(false); //ta bort loading state
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