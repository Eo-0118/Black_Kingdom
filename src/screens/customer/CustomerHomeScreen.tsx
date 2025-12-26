// src/screens/customer/CustomerHomeScreen.tsx
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

type Nav = any; // 필요하면 프로젝트 네비 타입으로 교체

// 예전 CustomerView/B2B에서 하던 역할들을
// 모바일용 홈에서 허브처럼 모아두는 느낌
export default function CustomerHomeScreen() {
  const navigation = useNavigation<Nav>();

  // TODO: 나중에 실제 로그인 정보/예약 정보 연동
  const customerName = '홍길동';
  const hasUpcomingReservation = true;
  const upcomingReservation = {
    date: '2025-12-05',
    time: '19:00',
    storeName: '블랙킹덤 식당',
    people: 2,
    status: '예약 확정',
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.headerBar}>
        <Text style={styles.headerGreeting}>
          안녕하세요, {customerName}님
        </Text>
        <Text style={styles.headerSubtitle}>
          오늘은 어디에서 식사하실 건가요?
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 다음 예약 카드 (예전: 내 예약 요약 / 메인 상단 박스 기능) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다가오는 예약</Text>
          {hasUpcomingReservation ? (
            <Pressable
              style={styles.reservationCard}
              onPress={() => navigation.navigate('CustomerReservations')}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.reservationStore}>
                  {upcomingReservation.storeName}
                </Text>
                <Text style={styles.reservationInfo}>
                  {upcomingReservation.date} · {upcomingReservation.time} ·{' '}
                  {upcomingReservation.people}명
                </Text>
                <Text style={styles.reservationStatus}>
                  {upcomingReservation.status}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>예약이 없습니다.</Text>
              <Text style={styles.emptyText}>
                지금 바로 식당을 찾아 예약해보세요.
              </Text>
            </View>
          )}
        </View>

        {/* 주요 메뉴 바로가기 (예전 CustomerView 메뉴들 역할) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>바로가기</Text>

          <View style={styles.quickRow}>
            <QuickAction
              label="식당 찾기"
              desc="지역 / 음식 종류로 검색"
              onPress={() => navigation.navigate('HomeScreen')}
            />
            <QuickAction
              label="내 예약"
              desc="다가오는 예약 / 지난 예약"
              onPress={() => navigation.navigate('CustomerReservations')}
            />
          </View>

          <View style={styles.quickRow}>
            <QuickAction
              label="쿠폰 / 혜택"
              desc="사용 가능한 쿠폰 확인"
              onPress={() => navigation.navigate('CustomerCoupons')}
            />
            <QuickAction
              label="마이페이지"
              desc="내 정보 · 이용 내역"
              onPress={() => navigation.navigate('CustomerMyPage')}
            />
          </View>
        </View>

        {/* 추천 식당 섹션 (예전: B2B/리스트 기능 요약) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 식당</Text>
          <RestaurantCard
            name="블랙킹덤 식당"
            area="강남 · 한식 · 고기"
            description="고급 한우와 다양한 와인 페어링 코스"
            onPress={() => navigation.navigate('ShopDetail', { placeId: 1, name: '블랙킹덤 식당', address: '강남 · 한식 · 고기', distance: '1km', waiting: '2팀', tag: '추천' })}
          />
          <RestaurantCard
            name="골목 파스타"
            area="홍대 · 이탈리안"
            description="캐주얼한 분위기의 파스타/리조또 전문점"
            onPress={() => navigation.navigate('ShopDetail', { placeId: 2, name: '골목 파스타', address: '홍대 · 이탈리안', distance: '500m', waiting: '1팀', tag: '신규' })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type QuickActionProps = {
  label: string;
  desc: string;
  onPress: () => void;
};

function QuickAction({ label, desc, onPress }: QuickActionProps) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickDesc}>{desc}</Text>
      <Text style={styles.quickMore}>자세히 보기 ›</Text>
    </Pressable>
  );
}

type RestaurantCardProps = {
  name: string;
  area: string;
  description: string;
  onPress: () => void;
};

function RestaurantCard({ name, area, description, onPress }: RestaurantCardProps) {
  return (
    <Pressable style={styles.restaurantCard} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.restaurantArea}>{area}</Text>
        <Text style={styles.restaurantDesc}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  // 다음 예약 카드
  reservationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  reservationStore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  reservationInfo: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  reservationStatus: {
    marginTop: 4,
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 11,
    color: '#6b7280',
  },

  // 바로가기 카드들
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  quickDesc: {
    marginTop: 4,
    fontSize: 11,
    color: '#6b7280',
  },
  quickMore: {
    marginTop: 6,
    fontSize: 11,
    color: '#111827',
    fontWeight: '500',
  },

  // 추천 식당 카드
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  restaurantArea: {
    marginTop: 2,
    fontSize: 11,
    color: '#6b7280',
  },
  restaurantDesc: {
    marginTop: 4,
    fontSize: 11,
    color: '#4b5563',
  },

  chevron: {
    fontSize: 20,
    color: '#9ca3af',
    marginLeft: 8,
  },
});