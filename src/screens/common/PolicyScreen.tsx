// src/screens/common/PolicyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PolicyScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>운영 정책</Text>
          <Text style={styles.subtitle}>취소 / 환불 / 약관 안내</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>예약 취소 정책</Text>
          <Text style={styles.body}>
            · 예약 2시간 전까지 무료 취소 가능합니다.{'\n'}
            · 그 이후 취소 시, 서비스 금액의 일부가 위약금으로 부과될 수 있습니다.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>환불 규정</Text>
          <Text style={styles.body}>
            · 서비스 미제공 시 100% 환불을 원칙으로 합니다.{'\n'}
            · 부분 이용 시에는 이용 내역에 따라 부분 환불 규정이 적용됩니다.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>서비스 이용 약관</Text>
          <Text style={styles.body}>
            · 블랙킹덤 서비스 이용약관 및 개인정보 처리방침은 추후 웹에서 작성한 내용을 그대로
            옮겨올 예정입니다.{'\n'}
            · 지금은 모바일 레이아웃만 먼저 맞춰둔 상태입니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },
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
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },
  body: { fontSize: 12, color: '#4b5563', lineHeight: 18 },
});