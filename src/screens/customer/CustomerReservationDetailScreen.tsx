// src/screens/customer/CustomerReservationDetailScreen.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

type ReservationStatus = 'confirmed' | 'pending' | 'canceled' | 'visited' | 'noShow';

type ReservationDetail = {
  id: string;
  restaurantName: string;
  date: string;
  time: string;
  people: number;
  status: ReservationStatus;
  memo?: string;
  address: string;
  phone: string;
  createdAt: string;
};

// TODO: 서버 붙기 전까지 임시 목데이터
const MOCK_RESERVATIONS_DETAIL: ReservationDetail[] = [
  {
    id: 'r1',
    restaurantName: '블랙킹덤 식당',
    date: '2025-12-05',
    time: '19:00',
    people: 2,
    status: 'confirmed',
    memo: '창가 자리 요청',
    address: '서울시 강남구 어딘가 123-4',
    phone: '02-123-4567',
    createdAt: '2025-12-01 14:23',
  },
  {
    id: 'r2',
    restaurantName: '골목 파스타',
    date: '2025-12-06',
    time: '12:30',
    people: 3,
    status: 'pending',
    memo: '생일 케이크 반입',
    address: '서울시 마포구 어딘가 45-6',
    phone: '02-987-6543',
    createdAt: '2025-12-02 11:05',
  },
];

type RouteParams = {
  id: string;
};

export default function CustomerReservationDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params as RouteParams;

  const reservation = useMemo(
    () => MOCK_RESERVATIONS_DETAIL.find(r => r.id === id),
    [id],
  );

  function goBack() {
    navigation.goBack();
  }

  if (!reservation) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerBar}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>예약 상세</Text>
            <Text style={styles.headerSubtitle}>예약 정보를 불러오지 못했습니다.</Text>
          </View>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            예약 정보를 찾을 수 없습니다.{'\n'}
            다시 시도해 주세요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    restaurantName,
    date,
    time,
    people,
    status,
    memo,
    address,
    phone,
    createdAt,
  } = reservation;

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
        return '#16a34a';
      case 'pending':
        return '#f97316';
      case 'canceled':
        return '#9ca3af';
      case 'visited':
        return '#111827';
      case 'noShow':
        return '#b91c1c';
      default:
        return '#6b7280';
    }
  })();

  const canChangeOrCancel =
    status === 'confirmed' || status === 'pending';

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>예약 상세</Text>
          <Text style={styles.headerSubtitle}>
            예약 정보를 확인하고 변경/취소할 수 있습니다.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 식당 정보 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.restaurantName}>{restaurantName}</Text>
              <Text style={styles.addressText}>{address}</Text>
              <Text style={styles.phoneText}>{phone}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>
        </View>

        {/* 예약 정보 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>예약 정보</Text>
          <Row label="예약 일시" value={`${date} · ${time}`} />
          <Row label="인원" value={`${people}명`} />
          <Row label="예약 생성 시간" value={createdAt} />
        </View>

        {/* 요청사항 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>요청사항</Text>
          {memo ? (
            <Text style={styles.memoText}>{memo}</Text>
          ) : (
            <Text style={styles.memoEmpty}>요청사항이 없습니다.</Text>
          )}
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.subButton]}
            onPress={() => {
              // TODO: 매장 상세로 이동 (id 기준으로 연결)
              navigation.navigate('ShopDetail', {
                name: restaurantName,
                address,
                distance: '',
                waiting: '',
              });
            }}
          >
            <Text style={styles.subButtonText}>매장 정보 보기</Text>
          </Pressable>

          {canChangeOrCancel && (
            <Pressable
              style={[styles.button, styles.mainButton]}
              onPress={() => {
                // TODO: 변경/취소 플로우 연결 (모달 or 별도 화면)
              }}
            >
              <Text style={styles.mainButtonText}>예약 변경 / 취소</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  card: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  addressText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  phoneText: {
    marginTop: 2,
    fontSize: 12,
    color: '#4b5563',
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

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rowLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  rowValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },

  memoText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  memoEmpty: {
    fontSize: 12,
    color: '#9ca3af',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subButton: {
    backgroundColor: '#e5e7eb',
  },
  subButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  mainButton: {
    backgroundColor: '#111827',
  },
  mainButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f9fafb',
  },

  errorBox: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    padding: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#b91c1c',
  },
});