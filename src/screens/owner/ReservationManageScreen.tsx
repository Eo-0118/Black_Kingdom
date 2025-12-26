import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  CustomerReservation,
  useCustomerReservations,
} from '../../context/CustomerReservationContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

type ReservationStatus = CustomerReservation['status'];
type TabKey = 'today' | 'upcoming' | 'past';

// Mock shop ID for owner until proper owner-shop linking is implemented
// This should eventually come from the logged-in owner's user object or a dedicated API.
const OWNER_PLACE_ID_MOCK = 1; // Assuming a mock shop ID for development

export default function ReservationManageScreen() {
  const { reservations, updateReservationStatus, fetchReservationsForShop } = useCustomerReservations();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const navigation = useNavigation();

  // Mock shop ID for owner until proper owner-shop linking is implemented
  const OWNER_PLACE_ID_MOCK = 1;

  useEffect(() => {
    if (user && user.role === 'owner') {
      fetchReservationsForShop(OWNER_PLACE_ID_MOCK);
    }
  }, [user, fetchReservationsForShop]);

  // Helper function to get today's date as a 'YYYY-MM-DD' string
  function getTodayString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const todayStr = getTodayString();

  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      // Robustly get the 'YYYY-MM-DD' part of the date string from the database
      const reservationDateStr = r.reservation_date.substring(0, 10); // This is the VISIT date

      switch (activeTab) {
        case 'today':
          return reservationDateStr === todayStr; // Compares VISIT date to today
        case 'upcoming':
          return reservationDateStr > todayStr; // Compares VISIT date to today
        case 'past':
          return reservationDateStr < todayStr; // Compares VISIT date to today
        default:
          return true; // Should not happen
      }
    });
  }, [activeTab, reservations, todayStr]);

  const handleChangeStatus = (reservationId: number, status: ReservationStatus) => {
    Alert.alert(
      '예약 상태 변경',
      `예약 ID: ${reservationId}의 상태를 ${status}로 변경합니다. (백엔드 연동 필요)`,
      [{ text: '확인', onPress: () => updateReservationStatus(reservationId, status) }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>예약 관리</Text>
          <Text style={styles.subtitle}>
            오늘 · 예정 · 지난 예약을 확인하고 상태를 변경하세요.
          </Text>
        </View>
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TabButton
          label="오늘 예약"
          active={activeTab === 'today'}
          onPress={() => setActiveTab('today')}
        />
        <TabButton
          label="예정"
          active={activeTab === 'upcoming'}
          onPress={() => setActiveTab('upcoming')}
        />
        <TabButton
          label="지난 내역"
          active={activeTab === 'past'}
          onPress={() => setActiveTab('past')}
        />
      </View>

      {/* 예약 리스트 */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {filteredReservations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>표시할 예약이 없습니다.</Text>
            <Text style={styles.emptyText}>
              선택한 탭에 해당하는 예약이 없습니다.\n
              다른 탭을 눌러보거나, 나중에 다시 확인해 주세요.
            </Text>
          </View>
        ) : (
          filteredReservations.map(reservation => (
            <ReservationCard
              key={reservation.reservation_id} // Use reservation_id
              reservation={reservation}
              onChangeStatus={handleChangeStatus}
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
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ReservationCardProps = {
  reservation: CustomerReservation;
  onChangeStatus: (reservationId: number, status: ReservationStatus) => void; // Use reservationId
};

function ReservationCard({ reservation, onChangeStatus }: ReservationCardProps) {
  const {
    reservation_id, // Use reservation_id
    guest_name, // Use guest_name
    number_of_people, // Use number_of_people
    reservation_date, // Use reservation_date
    reservation_time, // Use reservation_time
    status,
    requests,
  } = reservation;

  const statusText = (() => {
    switch (status) {
      case 'pending': return '대기'; // Lowercase
      case 'confirmed': return '확정'; // Lowercase
      case 'completed': return '방문 완료'; // Lowercase
      case 'cancelled': return '취소'; // Lowercase
      default: return status;
    }
  })();

  const statusColor = (() => {
    switch (status) {
      case 'pending': return '#f97316'; // 주황
      case 'confirmed': return '#16a34a'; // 초록
      case 'completed': return '#4b5563'; // 진회색
      case 'cancelled': return '#9ca3af'; // 연회색
      default: return '#6b7280';
    }
  })();

  return (
    <View style={styles.card}>
      {/* 상단: 이름 + 일시 + 상태 */}
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.customerName}>{guest_name}</Text>
          <Text style={styles.timeText}>
            {reservation_date.substring(0, 10)} · {reservation_time.substring(0, 5)} · {number_of_people}명
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      {/* 테이블/룸, 요청사항 */}
      <View style={styles.cardBody}>
        {requests ? (
          <Text style={styles.memoText}>요청사항: {requests}</Text>
        ) : null}
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actionRow}>
        {status === 'pending' && ( // Lowercase
          <>
            <SmallButton
              label="예약 확정"
              type="primary"
              onPress={() => onChangeStatus(reservation_id, 'confirmed')} // Lowercase
            />
            <SmallButton
              label="예약 취소"
              type="danger"
              onPress={() => onChangeStatus(reservation_id, 'cancelled')} // Lowercase
            />
          </>
        )}

        {status === 'confirmed' && ( // Lowercase
          <>
            <SmallButton
              label="방문 완료 처리"
              type="primary"
              onPress={() => onChangeStatus(reservation_id, 'completed')} // Lowercase
            />
            <SmallButton
              label="예약 취소"
              type="danger"
              onPress={() => onChangeStatus(reservation_id, 'cancelled')} // Lowercase
            />
          </>
        )}

        {status === 'completed' && ( // Lowercase
          <SmallButton
            label="상태 되돌리기 (확정으로)"
            type="ghost"
            onPress={() => onChangeStatus(reservation_id, 'confirmed')} // Lowercase
          />
        )}

        {status === 'cancelled' && ( // Lowercase
          <SmallButton
            label="상태 되돌리기 (대기로)"
            type="ghost"
            onPress={() => onChangeStatus(reservation_id, 'pending')} // Lowercase
          />
        )}
      </View>
    </View>
  );
}

type SmallButtonProps = {
  label: string;
  type: 'primary' | 'danger' | 'ghost';
  onPress: () => void;
};

function SmallButton({ label, type, onPress }: SmallButtonProps) {
  return (
    <Pressable
      style={[
        styles.smallButton,
        type === 'primary' && styles.smallButtonPrimary,
        type === 'danger' && styles.smallButtonDanger,
        type === 'ghost' && styles.smallButtonGhost,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.smallButtonText,
          type === 'ghost' && styles.smallButtonTextGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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
    gap: 8,
  },
  backButton: {
    marginBottom: 8,
    paddingVertical: 4,
    paddingRight: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '600',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 12, color: '#6b7280' },

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
  emptyTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },
  emptyText: { fontSize: 12, color: '#6b7280', lineHeight: 18 },

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
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#f9fafb',
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#111827',
  },
  memoText: {
    marginTop: 4,
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 17,
  },
  actionRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  smallButtonPrimary: {
    backgroundColor: '#111827',
  },
  smallButtonDanger: {
    backgroundColor: '#b91c1c',
  },
  smallButtonGhost: {
    backgroundColor: '#e5e7eb',
  },
  smallButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f9fafb',
  },
  smallButtonTextGhost: {
    color: '#111827',
  },
});