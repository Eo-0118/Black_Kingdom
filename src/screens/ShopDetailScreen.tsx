import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import Chip from '../components/Chip';
import { useCustomerReservations } from '../context/CustomerReservationContext';

type CustomerCreateReservationParams = {
  CustomerCreateReservation: {
    name: string;
    address: string;
    distance: string;
  };
};

type CustomerCreateReservationRouteProp = RouteProp<
  CustomerCreateReservationParams,
  'CustomerCreateReservation'
>;

export default function CustomerCreateReservationScreen() {
  const route = useRoute<CustomerCreateReservationRouteProp>();
  const navigation = useNavigation<any>();
  const { name, address, distance } = route.params ?? {
    name: '매장 이름',
    address: '주소 정보',
    distance: '0m',
  };
  const { addReservation } = useCustomerReservations();

  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [requests, setRequests] = useState('');

  function formatVisitDate(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function handleSubmit() {
    if (!time) {
      Alert.alert('시간 선택', '방문하실 시간을 선택해 주세요.');
      return;
    }

    if (!guestName.trim() || !guestPhone.trim()) {
      Alert.alert('예약자 정보', '예약자 이름과 연락처를 입력해 주세요.');
      return;
    }

    const dateLabel = formatVisitDate(visitDate);

    addReservation({
      restaurantName: name,
      restaurantAddress: address,
      date: dateLabel,
      time,
      people,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      requests,
    });

    // TODO: 여기에서 실제 서버로 예약 생성 API 호출
    Alert.alert(
      '예약 요청 완료',
      `${name}\n` +
        `${dateLabel} ${time} / ${people}명\n` +
        `예약자: ${guestName} (${guestPhone})\n` +
        '예약 요청을 보냈습니다.',
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
    <SafeAreaView style={styles.root}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>예약하기</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 언제 방문하시나요? */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>언제 방문하시나요?</Text>
        <Pressable
          style={styles.dateBox}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateLabel}>방문 날짜</Text>
          <Text style={styles.dateValue}>{formatVisitDate(visitDate)}</Text>
        </Pressable>
        <Text style={styles.sectionHint}>
          * 달력을 열어 원하는 날짜를 선택해주세요.
        </Text>
        {showDatePicker && (
          <>
            <DateTimePicker
              value={visitDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (selectedDate) {
                  setVisitDate(selectedDate);
                }
              }}
            />
            {Platform.OS === 'ios' && (
              <Pressable
                style={styles.dateConfirmButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.dateConfirmText}>확인</Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      {/* 방문 시간 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>방문 시간</Text>
        <View style={styles.chipRow}>
          {['10:00', '11:00', '12:00', '13:00', '14:00'].map((t) => (
            <Chip
              key={t}
              label={t}
              active={time === t}
              onPress={() => setTime(t)}
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
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="요청사항이 있으시면 적어주세요."
          placeholderTextColor="#9ca3af"
          multiline
          value={requests}
          onChangeText={setRequests}
        />
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>예약 요청하기</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
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
  input: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backText: {
    fontSize: 20,
    color: '#111827',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  dateConfirmButton: {
    marginTop: 10,
    backgroundColor: '#111827',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateConfirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});