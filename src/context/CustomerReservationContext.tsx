// src/contexts/CustomerReservationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';


export type CustomerReservation = {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  date: string;   // 'YYYY-MM-DD'
  time: string;   // '18:00'
  people: number;
  guestName: string;
  guestPhone: string;
  requests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
};

type CustomerReservationContextValue = {
  reservations: CustomerReservation[];
  addReservation: (r: Omit<CustomerReservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (
    reservationId: string,
    status: CustomerReservation['status'],
  ) => void;
};

const CustomerReservationContext = createContext<CustomerReservationContextValue | null>(
  null,
);

export function CustomerReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);

  function addReservation(
    r: Omit<CustomerReservation, 'id' | 'createdAt' | 'status'>,
  ) {
    const now = new Date();
    const id = `${now.getTime()}`;
    const createdAt = now.toISOString();

    const newReservation: CustomerReservation = {
      id,
      createdAt,
      status: 'PENDING',
      ...r,
    };

    setReservations(prev => [newReservation, ...prev]);
  }

  function updateReservationStatus(
    reservationId: string,
    status: CustomerReservation['status'],
  ) {
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status } : r)),
    );
  }

  return (
    <CustomerReservationContext.Provider
      value={{ reservations, addReservation, updateReservationStatus }}
    >
      {children}
    </CustomerReservationContext.Provider>
  );
}

export function useCustomerReservations() {
  const ctx = useContext(CustomerReservationContext);
  if (!ctx) {
    throw new Error('useCustomerReservations must be used within CustomerReservationProvider');
  }
  return ctx;
}