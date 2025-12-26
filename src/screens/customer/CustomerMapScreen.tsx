// src/screens/customer/CustomerMapScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerMapScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>지도에서 찾기</Text>
        <Text style={styles.subtitle}>카카오 지도로 매장을 검색할 예정입니다.</Text>
      </View>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>여기에 카카오맵(WebView) 들어갈 예정</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  mapPlaceholder: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 12,
    color: '#6b7280',
  },
});