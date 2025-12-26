// src/screens/owner/UsageHistoryScreen.tsx
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

// 이용 내역 타입
type VisitStatus = 'visited' | 'noShow' | 'canceled';

type UsageRecord = {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  customerName: string;
  people: number;
  courseName: string; // 이용한 메뉴/코스
  amount: number;     // 결제 금액
  status: VisitStatus;
  memo?: string;
};

// 필터 탭
type TabKey = 'all' | 'thisMonth' | 'noShow';

// 목데이터 (나중에 서버 연동으로 교체 예정)
const MOCK_USAGE: UsageRecord[] = [
  {
    id: 'u1',
    date: '2025-12-03',
    time: '19:00',
    customerName: '김민수',
    people: 2,
    courseName: '2인 디너 세트',
    amount: 85000,
    status: 'visited',
    memo: '생일 파티, 디저트에 메세지 요청',
  },
  {
    id: 'u2',
    date: '2025-12-02',
    time: '12:30',
    customerName: '박지혜',
    people: 3,
    courseName: '런치 코스',
    amount: 72000,
    status: 'visited',
  },
  {
    id: 'u3',
    date: '2025-11-30',
    time: '18:30',
    customerName: '최영수',
    people: 4,
    courseName: '단체 예약 (코스)',
    amount: 180000,
    status: 'noShow',
    memo: '사전 연락 없이 미방문',
  },
  {
    id: 'u4',
    date: '2025-11-29',
    time: '20:00',
    customerName: '이서현',
    people: 2,
    courseName: '와인 페어링 디너',
    amount: 120000,
    status: 'canceled',
    memo: '당일 취소',
  },
];

export default function UsageHistoryScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<TabKey>('all');

  // TODO: 실제로는 new Date()로 이번 달 계산
  const currentMonth = '2025-12';

  // 탭에 따른 필터링
  const filtered = useMemo(() => {
    switch (tab) {
      case 'thisMonth':
        return MOCK_USAGE.filter(record => record.date.startsWith(currentMonth));
      case 'noShow':
        return MOCK_USAGE.filter(record => record.status === 'noShow');
      case 'all':
      default:
        return MOCK_USAGE;
    }
  }, [tab, currentMonth]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>이용 내역</Text>
          <Text style={styles.subtitle}>지난 방문 · 결제 내역을 확인하세요.</Text>
        </View>
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TabButton
          label="전체"
          active={tab === 'all'}
          onPress={() => setTab('all')}
        />
        <TabButton
          label="이번 달"
          active={tab === 'thisMonth'}
          onPress={() => setTab('thisMonth')}
        />
        <TabButton
          label="노쇼"
          active={tab === 'noShow'}
          onPress={() => setTab('noShow')}
        />
      </View>

      {/* 리스트 */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>표시할 이용 내역이 없습니다.</Text>
            <Text style={styles.emptyText}>
              선택한 조건에 해당하는 이용 내역이 없습니다.{'\n'}
              다른 탭을 선택하거나 기간을 조정해 보세요.
            </Text>
          </View>
        ) : (
          filtered.map(record => <UsageCard key={record.id} record={record} />)
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

type UsageCardProps = {
  record: UsageRecord;
};

function UsageCard({ record }: UsageCardProps) {
  const { date, time, customerName, people, courseName, amount, status, memo } =
    record;

  const statusText = (() => {
    switch (status) {
      case 'visited':
        return '방문 완료';
      case 'noShow':
        return '노쇼';
      case 'canceled':
        return '취소';
      default:
        return status;
    }
  })();

  const statusColor = (() => {
    switch (status) {
      case 'visited':
        return '#16a34a'; // 초록
      case 'noShow':
        return '#f97316'; // 주황
      case 'canceled':
        return '#9ca3af'; // 회색
      default:
        return '#6b7280';
    }
  })();

  return (
    <View style={styles.card}>
      {/* 상단: 날짜/시간 + 상태 */}
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateText}>
            {date} · {time} · {people}명
          </Text>
          <Text style={styles.customerName}>
            {customerName} · {courseName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      {/* 금액 / 메모 */}
      <View style={styles.cardBody}>
        <Text style={styles.amountText}>
          결제 금액{' '}
          <Text style={styles.amountStrong}>
            {amount.toLocaleString('ko-KR')}원
          </Text>
        </Text>
        {memo ? <Text style={styles.memoText}>{memo}</Text> : null}
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
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
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  customerName: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
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
  amountText: {
    fontSize: 12,
    color: '#111827',
  },
  amountStrong: {
    fontWeight: '700',
  },
  memoText: {
    marginTop: 4,
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 17,
  },
});