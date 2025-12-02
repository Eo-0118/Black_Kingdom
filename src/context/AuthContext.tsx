// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'owner' | 'admin';

type User = {
  id: string;
  email: string;
  nickname?: string;
  role?: UserRole;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    email: string;
    password: string;
    nickname?: string;
    phone_number: string;
    date_of_birth: string;
    sido: string;
    sigungu: string;
    dong: string;
    gender: string;
  }) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status !== 200) {
        const errorData = await res.json();
        console.error('Login failed:', errorData.message);
        return false;
      }

      const data = await res.json();
      setUser(data.user);
      return true;
    } catch (e) {
      console.error('An unexpected error occurred during login:', e);
      return false;
    }
  };

  const signup = async (data: any) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status !== 201) {
        const errorData = await res.json();
        console.error('Signup failed:', errorData.message);
        return false;
      }

      return true;
    } catch (e) {
      console.error('An unexpected error occurred during signup:', e);
      return false;
    }
  };

  const logout = () => setUser(null);

  const setRole = (role: UserRole) => {
    setUser(prev => (prev ? { ...prev, role} : prev));
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}