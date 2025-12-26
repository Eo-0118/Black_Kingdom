// src/screens/UsageStatsScreen.tsx
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

type VisitChannel = 'app' | 'phone' | 'walkIn' | 'other';

type Visit = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isReturning: boolean;
  channel: VisitChannel;
};

const MOCK_VISITS: Visit[] = [
  { date: '2025-12-03', time: '19:00', isReturning: true, channel: 'app' },
  { date: '2025-12-03', time: '18:30', isReturning: false, channel: 'app' },
  { date: '2025-12-03', time: '12:30', isReturning: true, channel: 'phone' },
  { date: '2025-12-02', time: '17:30', isReturning: true, channel: 'app' },
  { date: '2025-12-02', time: '13:00', isReturning: false, channel: 'walkIn' },
  { date: '2025-12-01', time: '19:00', isReturning: true, channel: 'app' },
  { date: '2025-12-01', time: '20:00', isReturning: false, channel: 'phone' },
  { date: '2025-11-30', time: '18:00', isReturning: true, channel: 'walkIn' },
  { date: '2025-11-30', time: '13:30', isReturning: false, channel: 'app' },
  { date: '2025-11-29', time: '12:00', isReturning: true, channel: 'other' },
  { date: '2025-11-29', time: '17:00', isReturning: false, channel: 'app' },
  { date: '2025-11-29', time: '19:30', isReturning: true, channel: 'phone' },
];

function getRevisitRate(visits: Visit[]): number {
  const total = visits.length;
  if (!total) return 0;
  const returning = visits.filter(v => v.isReturning).length;
  return Math.round((returning / total) * 100);
}

function getAverageDailyVisits(visits: Visit[]): number {
  if (!visits.length) return 0;
  const days = new Set(visits.map(v => v.date));
  return Math.round(visits.length / days.size);
}

function hourRangeLabel(hour: number): string {
  const start = hour.toString().padStart(2, '0');
  const end = (hour + 1).toString().padStart(2, '0');
  return `${start}:00 ~ ${end}:00`;
}

function getPeakHours(visits: Visit[]): { label: string; count: number }[] {
  const buckets: Record<string, number> = {};
  visits.forEach(v => {
    const hour = parseInt(v.time.slice(0, 2), 10);
    const label = hourRangeLabel(hour);
    buckets[label] = (buckets[label] || 0) + 1;
  });

  return Object.entries(buckets)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function getChannelPercents(visits: Visit[]): Record<VisitChannel, number> {
  const total = visits.length;
  const base: Record<VisitChannel, number> = {
    app: 0,
    phone: 0,
    walkIn: 0,
    other: 0,
  };
  if (!total) return base;

  visits.forEach(v => {
    base[v.channel] += 1;
  });

  (Object.keys(base) as VisitChannel[]).forEach(key => {
    base[key] = Math.round((base[key] / total) * 100);
  });

  return base;
}

export default function UsageStatsScreen() {
  const navigation = useNavigation<any>();
  const revisitRate = getRevisitRate(MOCK_VISITS);
  const avgDailyVisits = getAverageDailyVisits(MOCK_VISITS);
  const peakHours = getPeakHours(MOCK_VISITS);
  const channelPercents = getChannelPercents(MOCK_VISITS);

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
        <Text style={styles.headerTitle}>이용 통계</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 상단 요약 카드들 */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardDark]}>
            <Text style={styles.summaryLabel}>재방문율</Text>
            <Text style={styles.summaryValue}>{revisitRate}%</Text>
            <Text style={styles.summaryDesc}>최근 이용 기준</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>하루 평균 방문</Text>
            <Text style={styles.summaryValue}>{avgDailyVisits}명</Text>
            <Text style={styles.summaryDesc}>최근 이용 기준</Text>
          </View>
        </View>

        {/* 피크 시간대 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>피크 시간대</Text>
          <Text style={styles.sectionDesc}>고객 방문이 가장 많은 시간</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>1위</Text>
            <Text style={styles.value}>{peakHours[0]?.label ?? '-'}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>2위</Text>
            <Text style={styles.value}>{peakHours[1]?.label ?? '-'}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>3위</Text>
            <Text style={styles.value}>{peakHours[2]?.label ?? '-'}</Text>
          </View>
        </View>

        {/* 서비스별 이용 비율 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>서비스별 이용 비율</Text>
          <Text style={styles.sectionDesc}>최근 30일 간 이용 기준</Text>

          <StatBar label="앱 예약" percent={channelPercents.app} />
          <StatBar label="전화 예약" percent={channelPercents.phone} />
          <StatBar label="현장 방문" percent={channelPercents.walkIn} />
          <StatBar label="기타" percent={channelPercents.other} />
        </View>

        {/* 메모 섹션 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>운영 팁</Text>
          <Text style={styles.bodyText}>
            · 피크 시간대에는 스태프 배치를 늘려 대기 시간을 줄여보세요.{'\n'}
            · 재방문율이 높은 고객에게는 쿠폰이나 프로모션을 제공하면 좋아요.{'\n'}
            · 한가한 시간대에 이벤트를 열어 전체 회전율을 높일 수 있습니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBar({ label, percent }: { label: string; percent: number }) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statPercent}>{percent}%</Text>
      </View>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${percent}%` }]} />
      </View>
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
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 14,
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
    marginRight: 10,
  },
  summaryCardDark: {
    backgroundColor: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  summaryDesc: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  bodyText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  statRow: {
    marginBottom: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#111827',
  },
  statPercent: {
    fontSize: 12,
    color: '#6b7280',
  },
  statBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  statBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
});