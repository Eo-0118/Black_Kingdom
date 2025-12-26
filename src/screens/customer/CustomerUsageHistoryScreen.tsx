// src/screens/customer/CustomerUsageHistoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerUsageHistoryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>이용 내역</Text>
        <Text style={styles.subtitle}>내가 다녀온 매장과 결제 내역</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.emptyTitle}>이용 내역 연동 준비 중</Text>
          <Text style={styles.emptyText}>
            AdminB2BView / CustomerView 쪽에서 사용했던{'\n'}
            이용 내역 로직을 이 화면에 맞춰서 옮겨올 예정입니다.
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