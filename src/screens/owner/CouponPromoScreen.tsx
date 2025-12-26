import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CouponStatus = 'active' | 'paused' | 'expired';

type Coupon = {
  id: string;
  name: string;
  description: string;
  discountText: string; // 표시용 (예: "₩3,000 할인")
  status: CouponStatus;
  target: 'new' | 'all' | 'vip';
  validUntil?: string; // YYYY-MM-DD, 없으면 상시
};

type TabKey = 'all' | 'active' | 'expired';

const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    name: '신규 고객 웰컴 쿠폰',
    description: '첫 방문 고객에게만 자동 발급되는 할인 쿠폰입니다.',
    discountText: '첫 방문 ₩3,000 할인',
    status: 'active',
    target: 'new',
    validUntil: '2025-12-31',
  },
  {
    id: 'c2',
    name: '평일 런치 전용 쿠폰',
    description: '월~금 11:00~15:00 사이 예약에만 적용되는 쿠폰입니다.',
    discountText: '런치 10% 할인',
    status: 'paused',
    target: 'all',
    validUntil: '2025-11-30',
  },
  {
    id: 'c3',
    name: '단골 고객 감사 쿠폰',
    description: '누적 방문 5회 이상 고객에게 제공되는 쿠폰입니다.',
    discountText: '디저트 서비스',
    status: 'expired',
    target: 'vip',
    validUntil: '2025-10-31',
  },
];

export default function CouponPromoScreen() {
  const navigation = useNavigation();

  const [tab, setTab] = useState<TabKey>('all');

  const filteredCoupons = useMemo(() => {
    switch (tab) {
      case 'active':
        return MOCK_COUPONS.filter(c => c.status === 'active' || c.status === 'paused');
      case 'expired':
        return MOCK_COUPONS.filter(c => c.status === 'expired');
      case 'all':
      default:
        return MOCK_COUPONS;
    }
  }, [tab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>쿠폰 · 프로모션</Text>
          <Text style={styles.subtitle}>고객 혜택과 이벤트를 관리하세요.</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 탭 영역 */}
        <View style={styles.tabRow}>
          <TabButton
            label="전체"
            active={tab === 'all'}
            onPress={() => setTab('all')}
          />
          <TabButton
            label="진행 중"
            active={tab === 'active'}
            onPress={() => setTab('active')}
          />
          <TabButton
            label="기간 만료"
            active={tab === 'expired'}
            onPress={() => setTab('expired')}
          />
        </View>

        {/* 쿠폰 리스트 */}
        {filteredCoupons.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>등록된 쿠폰이 없습니다.</Text>
            <Text style={styles.cardDesc}>
              새 쿠폰을 만들어 고객님께 혜택을 제공해 보세요.
            </Text>
          </View>
        ) : (
          filteredCoupons.map(coupon => (
            <View key={coupon.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardTitle}>{coupon.name}</Text>
                  <Text style={styles.cardSub}>{coupon.discountText}</Text>
                </View>
                <View>
                  <Text style={[styles.badge, getStatusBadgeStyle(coupon.status)]}>
                    {getStatusLabel(coupon.status)}
                  </Text>
                  <Text style={styles.badgeSub}>{getTargetLabel(coupon.target)}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{coupon.description}</Text>
              {coupon.validUntil ? (
                <Text style={styles.validText}>유효 기간: {coupon.validUntil} 까지</Text>
              ) : (
                <Text style={styles.validText}>유효 기간: 상시</Text>
              )}
            </View>
          ))
        )}

        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 새 쿠폰 만들기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function getStatusLabel(status: CouponStatus) {
  switch (status) {
    case 'active':
      return '진행 중';
    case 'paused':
      return '일시 중지';
    case 'expired':
      return '기간 만료';
    default:
      return status;
  }
}

function getStatusBadgeStyle(status: CouponStatus) {
  switch (status) {
    case 'active':
      return { backgroundColor: '#16a34a' };
    case 'paused':
      return { backgroundColor: '#f97316' };
    case 'expired':
      return { backgroundColor: '#9ca3af' };
    default:
      return {};
  }
}

function getTargetLabel(target: Coupon['target']) {
  switch (target) {
    case 'new':
      return '신규 고객 대상';
    case 'all':
      return '전체 고객 대상';
    case 'vip':
      return '단골 고객 대상';
    default:
      return '';
  }
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
  },
  backText: {
    fontSize: 26,
    color: '#111827',
    marginRight: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  tabRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#111827',
  },
  tabLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#f9fafb',
    fontWeight: '600',
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  cardSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  cardDesc: { fontSize: 11, color: '#6b7280', marginTop: 10, lineHeight: 17 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
    color: '#f9fafb',
    fontSize: 11,
  },
  badgeSub: {
    marginTop: 4,
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
  },
  validText: {
    marginTop: 8,
    fontSize: 11,
    color: '#6b7280',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#f9fafb', fontSize: 13, fontWeight: '600' },
});