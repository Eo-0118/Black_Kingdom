import React, { createContext, useContext, useState, ReactNode } from 'react';

// Backend response for a reservation, including server-generated ID and status
export type CustomerReservation = {
  reservation_id: number; // Changed from 'id' to 'reservation_id' and type to number
  place_id: number;
  user_id: number;
  restaurant_name: string;
  restaurant_address: string;
  reservation_date: string; // 'YYYY-MM-DD'
  reservation_time: string; // 'HH:MM'
  number_of_people: number;
  guest_name: string;
  guest_phone: string;
  requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // Matches backend ENUM
  created_at: string; // Matches backend DATETIME
};

// Data structure expected by addReservation, to be sent to backend
export type NewReservationData = Omit<
  CustomerReservation,
  'reservation_id' | 'status' | 'created_at' | 'restaurant_name' | 'restaurant_address'
> & {
  restaurantName: string; // Used temporarily by frontend before place_id mapping
  restaurantAddress: string; // Used temporarily by frontend before place_id mapping
};


type CustomerReservationContextValue = {
  reservations: CustomerReservation[];
  addReservation: (data: NewReservationData) => Promise<boolean>; // Returns boolean for success/failure
  updateReservationStatus: (
    reservationId: number, // Changed to number
    status: CustomerReservation['status'],
  ) => void;
  fetchReservationsForShop: (shopId: number) => Promise<void>;
};

const CustomerReservationContext = createContext<CustomerReservationContextValue | null>(
  null,
);

const API_URL = 'http://localhost:3000'; // Backend API URL

export function CustomerReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);

  const addReservation = async (data: NewReservationData) => {
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place_id: data.place_id,
          user_id: data.user_id,
          reservation_date: data.reservation_date,
          reservation_time: data.reservation_time,
          number_of_people: data.number_of_people,
          guest_name: data.guest_name,
          guest_phone: data.guest_phone,
          requests: data.requests,
          // restaurant_name and restaurant_address are derived from place_id in backend if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add reservation:', errorData.message);
        return false;
      }

      const responseData = await response.json();
      console.log('Reservation added successfully:', responseData);

      // Fetch fresh reservations for the shop to ensure consistency, or append if response includes full object
      // For now, if successful, we assume it's added and can refetch or reconstruct.
      // A more robust implementation would return the full reservation object from backend.
      // For simplicity, we'll return true. The display list will be handled by fetchReservationsForShop or similar.
      return true;
    } catch (error) {
      console.error('Error in addReservation:', error);
      return false;
    }
  };

  const updateReservationStatus = (
    reservationId: number,
    status: CustomerReservation['status'],
  ) => {
    // This function will need to call a backend API to update status
    console.log(`Updating reservation ${reservationId} status to ${status} (backend call needed)`);
    setReservations(prev =>
      prev.map(r => (r.reservation_id === reservationId ? { ...r, status } : r)),
    );
  };

  const fetchReservationsForShop = async (shopId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/reservations/shop/${shopId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch reservations:', errorData.message);
        return;
      }
      const data: CustomerReservation[] = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations for shop:', error);
    }
  };

  return (
    <CustomerReservationContext.Provider
      value={{ reservations, addReservation, updateReservationStatus, fetchReservationsForShop }}
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