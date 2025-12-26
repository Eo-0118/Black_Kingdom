// src/screens/customer/CustomerReservationListScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerReservationListScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>내 예약</Text>
        <Text style={styles.subtitle}>진행 중/지난 예약을 확인하세요.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* TODO: 나중에 서버 연동 후 실제 예약 리스트 표시 */}
        <View style={styles.card}>
          <Text style={styles.emptyTitle}>예약 내역 연동 전</Text>
          <Text style={styles.emptyText}>
            나중에 서버 API 연동 후,{'\n'}
            웹에서 구현한 예약 내역 로직을 이 화면에 옮길 예정입니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },
  emptyText: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
});