// src/navigation/CustomerNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import RestaurantListScreen from '../screens/customer/CustomerReservationListScreen';
import RestaurantDetailScreen from '../screens/customer/CustomerReservationDetailScreen';
import ReservationScreen from '../screens/customer/CustomerReservationsScreen';
import MyReservationsScreen from '../screens/customer/CustomerHomeScreen';
import MyPageScreen from '../screens/customer/CustomerQuickReserveScreen';
import { CustomerReservationProvider } from '../context/CustomerReservationContext';

const Stack = createNativeStackNavigator();

export default function CustomerNavigator() {
  return (
    <CustomerReservationProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
        <Stack.Screen name="RestaurantList" component={RestaurantListScreen} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        <Stack.Screen name="MyReservations" component={MyReservationsScreen} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />
      </Stack.Navigator>
    </CustomerReservationProvider>
  );
}