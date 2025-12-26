import React, { createContext, useContext, useState, ReactNode } from 'react';

// This mirrors the backend's User entity, can be expanded later
export type User = {
  id: string;
  email: string;
  nickname?: string;
  role?: UserRole;
  // Add other user fields as needed
};

export type UserRole = 'customer' | 'owner' | 'admin';

// The data structure for the signup form
export type SignupData = {
  email: string;
  password?: string;
  nickname?: string;
  date_of_birth?: string;
  phone_number?: string;
  sido?: string;
  sigungu?: string;
  dong?: string;
  gender?: 'male' | 'female' | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define your backend URL here
const API_URL = 'http://localhost:3000'; // Assuming the backend runs on this port

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Fake login remains for development purposes or can be updated to call backend
  const login = async (email: string, _password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: _password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        return false;
      }

      const responseData = await response.json();
      console.log('Login successful:', responseData);
      setUser(responseData.user); // Assuming responseData.user contains User object

      return true;
    } catch (error) {
      console.error('An error occurred during login:', error);
      return false;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.message);
        return false;
      }

      const responseData = await response.json();
      console.log('Signup successful:', responseData);
      // After successful signup, you might want to log the user in automatically
      // For now, we just return true. A real app might auto-login or redirect.

      return true;
    } catch (error) {
      console.error('An error occurred during signup:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    console.log('User logged out');
  };

  const setRole = (role: UserRole) => {
    setUser((prev) => {
      const newUser = prev ? { ...prev, role } : null;
      console.log('User role set to:', newUser?.role);
      return newUser;
    });
  };

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