'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
//interface för auth context
interface AuthContextType {
  token: string | null; //jwt token
  user: { id: string; email: string } | null; //inloggad användare
  login: (token: string, user: { id: string; email: string }) => void;  //funktion för att logga in
  logout: () => void; //logga ut funktion
  isAuthenticated: boolean; // Boolean för att kolla om användaren är inloggad
}
//skapar context för auth
const AuthContext = createContext<AuthContextType | undefined>(undefined);
//auth provider komponent som wrappas runt appen för att ge access till auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const router = useRouter();
  //kollar local storage för sparad token och user vid mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    //om både token och user finns sparade, sätt dem i state.
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);
  //login funktion som sprarar token och user i state och local storgage
  const login = (newToken: string, newUser: { id: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };
  //logout funktion som rensar state och local storgare. Man blir omdirigerad till login sidan
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}