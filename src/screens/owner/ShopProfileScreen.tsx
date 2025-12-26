// src/screens/owner/ShopProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopProfileScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>매장 정보 수정</Text>
          <Text style={styles.subtitle}>매장명, 위치, 운영시간 등을 관리하세요.</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* TODO: 나중에 실제 입력 폼 + 지도(카카오) 연동 */}
        <View style={styles.card}>
          <Text style={styles.label}>매장명</Text>
          <Text style={styles.value}>블랙킹덤</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>운영 시간</Text>
          <Text style={styles.value}>평일 11:00 ~ 21:00{'\n'}주말 12:00 ~ 20:00</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>주소 / 위치</Text>
          <Text style={styles.value}>지도 연동 후 위치를 설정할 수 있게 만들 예정입니다.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  value: { fontSize: 13, color: '#111827', lineHeight: 18 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 4,
    marginRight: 12,
  },
  backText: {
    fontSize: 26,
    color: '#111827',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 12, color: '#6b7280' },
});