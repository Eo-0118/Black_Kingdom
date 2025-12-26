// src/screens/customer/CustomerQuickReserveScreen.tsx
import React, { useState } from 'react';
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

type Nav = any;

type RestaurantOption = {
  id: string;
  name: string;
  area: string;
  desc: string;
};

const RESTAURANTS: RestaurantOption[] = [
  {
    id: 'r1',
    name: '블랙킹덤 식당',
    area: '강남 · 한식',
    desc: '한우 · 정식 · 단체석',
  },
  {
    id: 'r2',
    name: '골목 파스타',
    area: '홍대 · 이탈리안',
    desc: '파스타 · 리조또 · 와인',
  },
  {
    id: 'r3',
    name: '야키토리 골목',
    area: '을지로 · 이자카야',
    desc: '꼬치 · 사케 · 1~2인',
  },
];

const PEOPLE_OPTIONS = [1, 2, 3, 4, 5, 6];
const TIME_OPTIONS = ['17:00', '18:00', '19:00', '20:00', '21:00'];

export default function CustomerQuickReserveScreen() {
  const navigation = useNavigation<Nav>();

  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>(
    'today',
  );
  const [selectedTime, setSelectedTime] = useState<string | null>('19:00');
  const [selectedPeople, setSelectedPeople] = useState<number>(2);
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string | null>('r1');

  const selectedRestaurant = RESTAURANTS.find(
    r => r.id === selectedRestaurantId,
  );

  function goBack() {
    navigation.goBack();
  }

  function handleSubmit() {
    if (!selectedRestaurant || !selectedTime) {
      Alert.alert('예약 정보 부족', '식당과 시간, 인원을 모두 선택해 주세요.');
      return;
    }

    // TODO: 여기에서 실제 백엔드에 예약 생성 API 호출
    Alert.alert(
      '예약 요청 완료',
      `${selectedRestaurant.name}\n` +
        `${selectedDate === 'today' ? '오늘' : '내일'} ${selectedTime}\n` +
        `${selectedPeople}명으로 예약 요청을 보냈습니다.`,
      [
        {
          text: '내 예약 보기',
          onPress: () => navigation.navigate('CustomerReservations'),
        },
        { text: '확인' },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>빠른 예약</Text>
          <Text style={styles.headerSubtitle}>
            날짜 · 시간 · 인원을 선택하고 바로 예약해 보세요.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 날짜 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>언제 방문하시나요?</Text>
          <View style={styles.chipRow}>
            <Chip
              label="오늘"
              active={selectedDate === 'today'}
              onPress={() => setSelectedDate('today')}
            />
            <Chip
              label="내일"
              active={selectedDate === 'tomorrow'}
              onPress={() => setSelectedDate('tomorrow')}
            />
          </View>
        </View>

        {/* 시간 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>방문 시간</Text>
          <View style={styles.chipRowWrap}>
            {TIME_OPTIONS.map(time => (
              <Chip
                key={time}
                label={time}
                active={selectedTime === time}
                onPress={() => setSelectedTime(time)}
              />
            ))}
          </View>
        </View>

        {/* 인원 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인원</Text>
          <View style={styles.chipRowWrap}>
            {PEOPLE_OPTIONS.map(p => (
              <Chip
                key={p}
                label={`${p}명`}
                active={selectedPeople === p}
                onPress={() => setSelectedPeople(p)}
              />
            ))}
          </View>
        </View>

        {/* 식당 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>식당 선택</Text>
          {RESTAURANTS.map(r => {
            const active = selectedRestaurantId === r.id;
            return (
              <Pressable
                key={r.id}
                style={[styles.restaurantCard, active && styles.restaurantCardActive]}
                onPress={() => setSelectedRestaurantId(r.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.restaurantName,
                      active && styles.restaurantNameActive,
                    ]}
                  >
                    {r.name}
                  </Text>
                  <Text
                    style={[
                      styles.restaurantArea,
                      active && styles.restaurantAreaActive,
                    ]}
                  >
                    {r.area}
                  </Text>
                  <Text
                    style={[
                      styles.restaurantDesc,
                      active && styles.restaurantDescActive,
                    ]}
                  >
                    {r.desc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 예약 버튼 */}
        <View style={styles.footer}>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>이 정보로 예약 요청하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
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
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },

  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#111827',
  },
  chipLabel: {
    fontSize: 12,
    color: '#374151',
  },
  chipLabelActive: {
    color: '#f9fafb',
    fontWeight: '600',
  },

  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  restaurantCardActive: {
    borderWidth: 1,
    borderColor: '#111827',
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  restaurantNameActive: {
    color: '#111827',
  },
  restaurantArea: {
    marginTop: 2,
    fontSize: 11,
    color: '#6b7280',
  },
  restaurantAreaActive: {
    color: '#4b5563',
  },
  restaurantDesc: {
    marginTop: 2,
    fontSize: 11,
    color: '#9ca3af',
  },
  restaurantDescActive: {
    color: '#6b7280',
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af',
    marginLeft: 8,
  },

  footer: {
    marginTop: 24,
  },
  submitButton: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f9fafb',
  },
});