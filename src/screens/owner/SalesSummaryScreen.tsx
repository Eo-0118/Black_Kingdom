// src/screens/SalesSummaryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Period = 'today' | 'week' | 'month';

type SalesItem = {
  id: string;
  date: string;
  label: string;
  amount: string;
};

const MOCK_SALES: Record<Period, SalesItem[]> = {
  today: [
    { id: '1', date: '오늘', label: '2인 디너 세트 외 3건', amount: '₩ 135,000' },
    { id: '2', date: '오늘', label: '런치 코스 1건', amount: '₩ 80,000' },
  ],
  week: [
    { id: '3', date: '11.18 (월)', label: '예약 5건', amount: '₩ 240,000' },
    { id: '4', date: '11.19 (화)', label: '예약 7건', amount: '₩ 325,000' },
    { id: '5', date: '11.20 (수)', label: '예약 3건', amount: '₩ 150,000' },
  ],
  month: [
    { id: '6', date: '11월 1주', label: '예약 23건', amount: '₩ 910,000' },
    { id: '7', date: '11월 2주', label: '예약 27건', amount: '₩ 1,120,000' },
  ],
};

function parseAmount(amountText: string): number {
  // 예: "₩ 135,000" -> 135000
  const cleaned = amountText.replace(/[^0-9]/g, '');
  if (!cleaned) return 0;
  return Number(cleaned);
}

export default function SalesSummaryScreen() {
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState<Period>('today');

  const items = MOCK_SALES[period];

  const totalAmountNumber = items.reduce((sum, item) => {
    return sum + parseAmount(item.amount);
  }, 0);

  const totalAmount = `₩ ${totalAmountNumber.toLocaleString('ko-KR')}`;

  function goBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>매출 정산</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 기간 선택 탭 */}
        <View style={styles.chipRow}>
          <PeriodChip
            label="오늘"
            active={period === 'today'}
            onPress={() => setPeriod('today')}
          />
          <PeriodChip
            label="이번 주"
            active={period === 'week'}
            onPress={() => setPeriod('week')}
          />
          <PeriodChip
            label="이번 달"
            active={period === 'month'}
            onPress={() => setPeriod('month')}
          />
        </View>

        {/* 요약 카드 */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {period === 'today'
              ? '오늘 총 매출'
              : period === 'week'
              ? '이번 주 총 매출'
              : '이번 달 총 매출'}
          </Text>
          <Text style={styles.summaryAmount}>{totalAmount}</Text>
          <Text style={styles.summaryDesc}>부가세 포함 기준, 취소된 예약 제외</Text>
        </View>

        {/* 리스트 */}
        <Text style={styles.sectionTitle}>상세 내역</Text>
        {items.map(item => (
          <View key={item.id} style={styles.rowCard}>
            <View>
              <Text style={styles.rowDate}>{item.date}</Text>
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Text style={styles.rowAmount}>{item.amount}</Text>
          </View>
        ))}

        {/* 다운로드 버튼 (자리만) */}
        <Pressable style={styles.downloadButton}>
          <Text style={styles.downloadText}>엑셀 / 정산 내역 내보내기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function PeriodChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 22,
    color: '#111827',
    marginTop: -2,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipText: {
    fontSize: 12,
    color: '#6b7280',
  },
  chipTextActive: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 11,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  rowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  rowDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  rowLabel: {
    fontSize: 13,
    color: '#111827',
  },
  rowAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    alignSelf: 'center',
  },
  downloadButton: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});