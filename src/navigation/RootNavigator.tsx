// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomerReservationProvider } from '../context/CustomerReservationContext';

import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import MyPageScreen from '../screens/MyPageScreen';
import OwnerHomeScreen from '../screens/owner/OwnerHomeScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import ReservationManageScreen from '../screens/owner/ReservationManageScreen';
import UsageHistoryScreen from '../screens/owner/UsageHistoryScreen';
import SalesSummaryScreen from '../screens/owner/SalesSummaryScreen';
import UsageStatsScreen from '../screens/owner/UsageStatsScreen';
import CouponPromoScreen from '../screens/owner/CouponPromoScreen';
import ShopProfileScreen from '../screens/owner/ShopProfileScreen';
import PolicyScreen from '../screens/common/PolicyScreen';
import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CustomerQuickReserveScreen from '../screens/customer/CustomerQuickReserveScreen';
import CustomerReservationListScreen from '../screens/customer/CustomerReservationListScreen';
import CustomerFavoriteShopsScreen from '../screens/customer/CustomerFavoriteShopsScreen';
import CustomerUsageHistoryScreen from '../screens/customer/CustomerUsageHistoryScreen';
import CustomerMapScreen from '../screens/customer/CustomerMapScreen';
import CustomerReservationsScreen from '../screens/customer/CustomerReservationsScreen';
import CustomerReservationDetailScreen from '../screens/customer/CustomerReservationDetailScreen';
import CustomerCreateReservationScreen from '../screens/customer/CustomerCreateReservationScreen';

type RootStackParamList = {
  Auth: undefined;
  Signup: undefined;
  Main: undefined;
  ShopDetail: {
    name: string;
    address: string;
    distance: string;
    waiting: string;
    tag?: string;
  };
  // 고객용
  CustomerHome: undefined;
  CustomerQuickReserve: undefined;
  CustomerReservationList: undefined;
  CustomerFavoriteShops: undefined;
  CustomerUsageHistory: undefined;
  CustomerMap: undefined;
  CustomerReservations: undefined;
  CustomerReservationDetail: { id: string };
  CustomerCreateReservation: {
    shopId?: string;
    name: string;
    address: string;
    distance: string;
  };
  // 사장님용
  OwnerHome: undefined;
  ReservationManage: undefined;
  UsageHistory: undefined;
  SalesSummary: undefined;
  UsageStats: undefined;
  CouponPromo: undefined;
  ShopProfile: undefined;
  // 공통
  Policy: undefined;
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="CustomerHome"
        component={CustomerHomeScreen}
        options={{ tabBarLabel: '리스트' }}
      />
      <Tab.Screen
        name="CustomerMap"
        component={CustomerMapScreen}
        options={{ tabBarLabel: '지도' }}
      />
      <Tab.Screen
        name="CustomerMyPage"
        component={MyPageScreen}
        options={{ tabBarLabel: '마이페이지' }}
      />
    </Tab.Navigator>
  );
}

function OwnerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="OwnerHome"
        component={OwnerHomeScreen}
        options={{ tabBarLabel: '사장님 홈' }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ tabBarLabel: '마이페이지' }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={user.role === 'owner' ? OwnerTabs : CustomerTabs}
          />
          <Stack.Screen name="ShopDetail" component={ShopDetailScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="ReservationManage"
            component={ReservationManageScreen}
          />
          <Stack.Screen name="UsageHistory" component={UsageHistoryScreen} />
          <Stack.Screen name="SalesSummary" component={SalesSummaryScreen} />
          <Stack.Screen name="UsageStats" component={UsageStatsScreen} />
          <Stack.Screen name="CouponPromo" component={CouponPromoScreen} />
          <Stack.Screen name="ShopProfile" component={ShopProfileScreen} />
          <Stack.Screen name="Policy" component={PolicyScreen} />
          <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
          <Stack.Screen name="CustomerQuickReserve" component={CustomerQuickReserveScreen} />
          <Stack.Screen name="CustomerReservationList" component={CustomerReservationListScreen} />
          <Stack.Screen name="CustomerFavoriteShops" component={CustomerFavoriteShopsScreen} />
          <Stack.Screen name="CustomerUsageHistory" component={CustomerUsageHistoryScreen} />
          <Stack.Screen name="CustomerReservations" component={CustomerReservationsScreen} />
          <Stack.Screen name="CustomerReservationDetail" component={CustomerReservationDetailScreen} />
          <Stack.Screen name="CustomerCreateReservation" component={CustomerCreateReservationScreen} />
          {/* 여기서 CustomerNavigator 스크린은 제거 */}
        </>
      )}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <CustomerReservationProvider>
      <RootStack />
    </CustomerReservationProvider>
  );
}