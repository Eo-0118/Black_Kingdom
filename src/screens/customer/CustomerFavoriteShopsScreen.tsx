// src/screens/customer/CustomerFavoriteShopsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerFavoriteShopsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>단골 매장</Text>
        <Text style={styles.subtitle}>즐겨찾기한 매장을 관리하세요.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.emptyTitle}>단골 매장 기능 준비 중</Text>
          <Text style={styles.emptyText}>
            웹에서 구현했던 즐겨찾기/단골 지정 로직을{'\n'}
            이 화면 구조 위에 그대로 옮길 예정입니다.
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