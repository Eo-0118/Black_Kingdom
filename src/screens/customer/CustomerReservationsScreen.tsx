// src/screens/customer/CustomerReservationsScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Nav = any;

type ReservationStatus = 'confirmed' | 'pending' | 'canceled' | 'visited' | 'noShow';

type Reservation = {
  id: string;
  restaurantName: string;
  date: string;     // YYYY-MM-DD
  time: string;     // HH:mm
  people: number;
  status: ReservationStatus;
  isPast: boolean;  // 지난 예약 여부
  memo?: string;
};

type TabKey = 'upcoming' | 'past';

// 예전 CustomerView / B2B에서 하던 기능을 모바일에 맞게 옮긴 목데이터
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'r1',
    restaurantName: '블랙킹덤 식당',
    date: '2025-12-05',
    time: '19:00',
    people: 2,
    status: 'confirmed',
    isPast: false,
    memo: '창가 자리 요청',
  },
  {
    id: 'r2',
    restaurantName: '골목 파스타',
    date: '2025-12-06',
    time: '12:30',
    people: 3,
    status: 'pending',
    isPast: false,
    memo: '생일 케이크 반입',
  },
  {
    id: 'r3',
    restaurantName: '블랙킹덤 식당',
    date: '2025-11-30',
    time: '18:30',
    people: 4,
    status: 'visited',
    isPast: true,
    memo: '단체 방문',
  },
  {
    id: 'r4',
    restaurantName: '골목 파스타',
    date: '2025-11-29',
    time: '19:00',
    people: 2,
    status: 'canceled',
    isPast: true,
    memo: '당일 취소',
  },
];

export default function CustomerReservationsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<TabKey>('upcoming');

  const filtered = useMemo(() => {
    if (tab === 'upcoming') {
      return MOCK_RESERVATIONS.filter(r => !r.isPast);
    }
    return MOCK_RESERVATIONS.filter(r => r.isPast);
  }, [tab]);

  function goBack() {
    navigation.goBack();
  }

  function openReservationDetail(reservation: Reservation) {
    // TODO: 실제 상세 화면 스크린 이름에 맞게 수정
    navigation.navigate('CustomerReservationDetail', { id: reservation.id });
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>내 예약</Text>
          <Text style={styles.headerSubtitle}>
            다가오는 예약과 지난 이용 내역을 확인하세요.
          </Text>
        </View>
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TabButton
          label="다가오는 예약"
          active={tab === 'upcoming'}
          onPress={() => setTab('upcoming')}
        />
        <TabButton
          label="지난 예약"
          active={tab === 'past'}
          onPress={() => setTab('past')}
        />
      </View>

      {/* 리스트 */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {tab === 'upcoming' ? '다가오는 예약이 없습니다.' : '지난 예약이 없습니다.'}
            </Text>
            <Text style={styles.emptyText}>
              {tab === 'upcoming'
                ? '새로운 식당을 찾아 예약해보세요.'
                : '조금 더 이용해 보시면 지난 예약이 쌓여요.'}
            </Text>
          </View>
        ) : (
          filtered.map(reservation => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onPress={() => openReservationDetail(reservation)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type TabButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabButton({ label, active, onPress }: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ReservationCardProps = {
  reservation: Reservation;
  onPress: () => void;
};

function ReservationCard({ reservation, onPress }: ReservationCardProps) {
  const { restaurantName, date, time, people, status, memo, isPast } = reservation;

  const statusText = (() => {
    switch (status) {
      case 'confirmed':
        return '예약 확정';
      case 'pending':
        return '승인 대기';
      case 'canceled':
        return '예약 취소';
      case 'visited':
        return '이용 완료';
      case 'noShow':
        return '노쇼';
      default:
        return status;
    }
  })();

  const statusColor = (() => {
    switch (status) {
      case 'confirmed':
        return '#16a34a'; // 초록
      case 'pending':
        return '#f97316'; // 주황
      case 'canceled':
        return '#9ca3af'; // 회색
      case 'visited':
        return '#111827'; // 진한 회색
      case 'noShow':
        return '#b91c1c'; // 빨강
      default:
        return '#6b7280';
    }
  })();

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <Text style={styles.dateText}>
            {date} · {time} · {people}명
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.cardBodyRow}>
        <View style={{ flex: 1 }}>
          {memo ? (
            <Text style={styles.memoText} numberOfLines={2}>
              요청사항: {memo}
            </Text>
          ) : (
            <Text style={styles.memoTextLight}>
              특별 요청사항이 없습니다.
            </Text>
          )}
        </View>

        {!isPast && (status === 'confirmed' || status === 'pending') ? (
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              // TODO: 예약 변경/취소 로직 연결
            }}
          >
            <Text style={styles.actionButtonText}>변경 / 취소</Text>
          </Pressable>
        ) : (
          <Text style={styles.cardRightHint}>
            자세히 보기 ›
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
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

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  emptyCard: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },

  card: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  dateText: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#f9fafb',
    fontWeight: '600',
  },
  cardBodyRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  memoText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 16,
  },
  memoTextLight: {
    fontSize: 11,
    color: '#9ca3af',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111827',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  cardRightHint: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 8,
  },
});