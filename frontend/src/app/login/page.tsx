"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";
import Link from "next/link";
//login sida. Låter användaren logga in med email och lösenord

export default function LoginPage(){
  //state för email, lösenord, error meddelande och loading status
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    //hook för auth context och routing
    const { login } = useAuth();
    const router = useRouter();
    //hanterar formulär submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
          //anropar login API med email och lösenord
            const data = await authAPI.login(email,password);
            //sparar token och user i auth context
            login(data.token, data.user);
            //efter man har loggat in, redirectas man till thank-you sidan
            router.push("/thank-you");
        } catch (err: any) {
          //om något går fel, sätt error meddelande
            setError(err.message || "något gick fel");
        } finally {
            setLoading(false);
        }
        
    }

    return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Logga in</h1>
        
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
              placeholder="Minst 8 tecken"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <p className={styles.link}>
          Har du inget konto? <Link href="/signup">Skapa konto</Link>
        </p>
      </div>
    </div>
    )
};


