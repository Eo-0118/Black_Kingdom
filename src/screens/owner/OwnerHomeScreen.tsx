// src/screens/owner/OwnerHomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type OwnerHomeNav = {
  navigate: (screen: string) => void;
};

type MenuButtonProps = {
  label: string;
  desc?: string;
  onPress?: () => void;
};

export default function OwnerHomeScreen() {
  const navigation = useNavigation<OwnerHomeNav>();

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>사장님 홈</Text>
        <Text style={styles.headerSubtitle}>매장 운영 현황 한눈에 보기</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 오늘 요약 */}
        <View style={styles.cardRow}>
          <View style={[styles.summaryCard, styles.summaryCardDark]}>
            <Text style={styles.summaryLabel}>오늘 예약</Text>
            <Text style={styles.summaryValue}>8건</Text>
            <Text style={styles.summaryDesc}>확정 · 대기 포함</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>오늘 예상 매출</Text>
            <Text style={styles.summaryValue}>₩420,000</Text>
            <Text style={styles.summaryDesc}>취소 건 제외</Text>
          </View>
        </View>

        {/* 예약 / 고객 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>예약 / 고객</Text>
          <View style={styles.menuGrid}>
            <MenuButton
              label="예약 관리"
              desc="오늘 · 예정 예약 확인"
              onPress={() => navigation.navigate('ReservationManage')}
            />
            <MenuButton
              label="이용 내역"
              desc="지난 방문 · 결제 내역"
              onPress={() => navigation.navigate('UsageHistory')}
            />
          </View>
        </View>

        {/* 정산 / 분석 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정산 / 분석</Text>
          <View style={styles.menuGrid}>
            <MenuButton
              label="매출 정산"
              desc="기간별 매출 확인"
              onPress={() => navigation.navigate('SalesSummary')}
            />
            <MenuButton
              label="이용 통계"
              desc="피크 시간 · 재방문율"
              onPress={() => navigation.navigate('UsageStats')}
            />
          </View>
        </View>

        {/* 홍보 / 매장 관리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>홍보 / 매장 관리</Text>
          <View style={styles.menuGrid}>
            <MenuButton
              label="쿠폰 · 프로모션"
              desc="고객 혜택 설정"
              onPress={() => navigation.navigate('CouponPromo')}
            />
            <MenuButton
              label="매장 정보 수정"
              desc="운영시간 · 위치 등"
              onPress={() => navigation.navigate('ShopProfile')}
            />
          </View>
        </View>

        {/* 정책 / 기타 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정책 / 기타</Text>
          <View style={styles.menuGrid}>
            <MenuButton
              label="운영 정책"
              desc="취소 · 환불 · 이용약관"
              onPress={() => navigation.navigate('Policy')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuButton({ label, desc, onPress }: MenuButtonProps) {
  return (
    <Pressable style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuTextBox}>
        <Text style={styles.menuLabel}>{label}</Text>
        {!!desc && <Text style={styles.menuDesc}>{desc}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6', // 전체 배경 (기존 디자인 유지)
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryCardDark: {
    backgroundColor: '#111827',
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  summaryDesc: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  menuGrid: {
    gap: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  menuTextBox: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  menuDesc: {
    marginTop: 3,
    fontSize: 11,
    color: '#6b7280',
  },
  menuArrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
});