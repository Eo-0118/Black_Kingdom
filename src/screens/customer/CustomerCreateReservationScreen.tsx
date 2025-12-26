import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCustomerReservations } from '../../context/CustomerReservationContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import DateTimePicker from '@react-native-community/datetimepicker';
import Chip from '../../components/Chip';

type ReservationRouteParams = {
  name?: string;
  address?: string;
  distance?: string;
  placeId: number; // Add placeId to route params
};

export default function CustomerCreateReservationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { name, address, distance, placeId } = (route.params || {}) as ReservationRouteParams;
  const { addReservation } = useCustomerReservations();
  const { user } = useAuth(); // Get user from AuthContext

  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [people, setPeople] = useState<number>(2);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [memo, setMemo] = useState('');

  const timeOptions = ['17:00', '18:00', '19:00', '20:00', '21:00'];
  const peopleOptions = [1, 2, 3, 4, 5, 6];

  function goBack() {
    navigation.goBack();
  }

  function formatVisitDate(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async function handleSubmit() { // Made async
    if (!user || !user.id) {
      Alert.alert('로그인 필요', '예약을 진행하려면 로그인해야 합니다.');
      return;
    }
    if (!placeId) {
      Alert.alert('매장 정보 부족', '예약할 매장 정보가 없습니다.');
      return;
    }
    if (!time) {
      Alert.alert('시간 선택', '방문하실 시간을 선택해 주세요.');
      return;
    }

    if (!guestName.trim() || !guestPhone.trim()) {
      Alert.alert('예약자 정보', '예약자 이름과 연락처를 입력해 주세요.');
      return;
    }

    const dateLabel = formatVisitDate(visitDate);

    // Prepare reservation data for backend
    const reservationData = {
      place_id: placeId,
      user_id: parseInt(user.id, 10), // Assuming user.id is string, convert to number
      restaurantName: name || '블랙킹덤 식당', // Passed for frontend display in alert
      restaurantAddress: address || '서울시 강남구 어딘가 123-4', // Passed for frontend display in alert
      reservation_date: dateLabel,
      reservation_time: time,
      number_of_people: people,
      guest_name: guestName,
      guest_phone: guestPhone,
      requests: memo,
    };

    const success = await addReservation(reservationData);

    if (success) {
      Alert.alert(
        '예약 요청 완료',
        `${name || '매장'}\n` +
          `${dateLabel} ${time} / ${people}명\n` +
          '예약 요청이 정상적으로 접수되었습니다.',
        [
          {
            text: '내 예약 보기',
            onPress: () => navigation.navigate('CustomerReservations'),
          },
          { text: '확인', onPress: () => navigation.goBack() },
        ],
      );
    } else {
      Alert.alert('예약 요청 실패', '예약 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={styles.headerBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>예약하기</Text>
          <Text style={styles.headerSubtitle}>
            방문 날짜 · 시간 · 인원을 선택하고 예약을 완료하세요.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 매장 카드 */}
        <View style={styles.shopCard}>
          <Text style={styles.shopName}>{name || '블랙킹덤 식당'}</Text>
          <Text style={styles.shopAddress}>{address || '서울시 강남구 어딘가 123-4'}</Text>
          {!!distance && <Text style={styles.shopDistance}>{distance}</Text>}
        </View>

        {/* 날짜 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>언제 방문하시나요?</Text>
          <Pressable style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateLabel}>방문 날짜</Text>
            <Text style={styles.dateValue}>{formatVisitDate(visitDate)}</Text>
          </Pressable>
          <Text style={styles.sectionHint}>
            * 달력을 열어 원하는 날짜를 선택해주세요.
          </Text>
        </View>

        {/* 방문 시간 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>방문 시간</Text>
          <View style={styles.chipRow}>
            {timeOptions.map((t) => (
              <Chip
                key={t}
                label={t}
                active={time === t}
                onPress={() => setTime(t)}
              />
            ))}
          </View>
        </View>

        {/* 인원 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인원</Text>
          <View style={styles.chipRow}>
            {peopleOptions.map((p) => (
              <Chip
                key={p}
                label={`${p}명`}
                active={people === p}
                onPress={() => setPeople(p)}
              />
            ))}
          </View>
        </View>

        {/* 예약자 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>예약자 정보</Text>
          <TextInput
            style={styles.input}
            placeholder="예약자 이름"
            placeholderTextColor="#9ca3af"
            value={guestName}
            onChangeText={setGuestName}
          />
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="연락처 (숫자만 입력)"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            value={guestPhone}
            onChangeText={setGuestPhone}
          />
        </View>

        {/* 요청사항 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요청사항</Text>
          <TextInput
            style={styles.memoInput}
            placeholder="요청사항이 있으시면 적어주세요."
            placeholderTextColor="#9ca3af"
            value={memo}
            onChangeText={setMemo}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>예약 요청하기</Text>
        </Pressable>
      </View>

      {/* 날짜 선택 오버레이 */}
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <Pressable
            style={styles.datePickerBackdrop}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={styles.datePickerSheet}>
            <DateTimePicker
              value={visitDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (Platform.OS === 'ios' && event.type === 'dismissed') {
                  setShowDatePicker(false);
                }
                if (selectedDate) {
                  setVisitDate(selectedDate);
                }
              }}
            />
            <Pressable
              style={styles.datePickerConfirm}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerConfirmText}>확인</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: {
    fontSize: 22,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: '#6b7280',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  shopCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
  },
  shopName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 12,
    color: '#6b7280',
  },
  shopDistance: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionHint: {
    marginTop: 6,
    fontSize: 11,
    color: '#9ca3af',
  },
  dateBox: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dateLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  input: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  memoInput: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
    minHeight: 120,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f3f4f6',
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    paddingVertical: 14,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f9fafb',
  },
  datePickerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  datePickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  datePickerSheet: {
    backgroundColor: '#f9fafb',
    paddingTop: 8,
    paddingBottom: 20,
  },
  datePickerConfirm: {
    marginTop: 8,
    alignSelf: 'flex-end',
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  datePickerConfirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f9fafb',
  },
});