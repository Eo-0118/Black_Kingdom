import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const navigation = useNavigation();
  const { signup, setRole } = useAuth();

  const [type, setType] = useState<'customer' | 'owner'>('customer');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sido, setSido] = useState(''); // New state for Si/Do
  const [sigungu, setSigungu] = useState(''); // New state for Si/Gun/Gu
  const [dong, setDong] = useState(''); // Existing state for Dong, now part of 3-step address
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email.includes('@')) return '이메일 형식이 올바르지 않습니다.';
    if (pw.length < 6) return '비밀번호는 6자 이상 입력해주세요.';
    if (pw !== pwConfirm) return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    if (!nickname.trim()) return '닉네임을 입력해주세요.';
    if (!dateOfBirth.trim()) return '생년월일을 입력해주세요. (예: 1999-01-01)';
    if (!phoneNumber.trim()) return '전화번호를 입력해주세요.';
    if (!sido.trim()) return '거주지(시/도)를 입력해주세요.';
    if (!sigungu.trim()) return '거주지(시/군/구)를 입력해주세요.';
    if (!dong.trim()) return '거주지(동)를 입력해주세요.';
    if (!gender) return '성별을 선택해주세요.';
    return null;
  }

  async function handleSignup() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    // The backend's signup endpoint expects these fields based on `backend/src/routes/auth.ts`
    const signupData = {
      email,
      password: pw,
      nickname,
      date_of_birth: dateOfBirth,
      phone_number: phoneNumber,
      sido, // New field
      sigungu, // New field
      dong, // Existing field, but now part of 3-step address
      gender,
    };

    const ok = await signup(signupData); // Assumes signup function is adapted to take an object
    setLoading(false);

    if (!ok) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // 선택한 역할 저장
    setRole(type);
    // 스택에서 뒤로 가면 RootNavigator 조건에 의해 Main으로 전환됨
    navigation.goBack();
  }

  function goBackToLogin() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* 상단 역할 탭 */}
          <View style={styles.tabWrapper}>
            <Pressable
              style={[styles.tab, type === 'customer' && styles.tabActive]}
              onPress={() => setType('customer')}>
              <Text
                style={[
                  styles.tabText,
                  type === 'customer' && styles.tabTextActive,
                ]}>
                고객님용
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, type === 'owner' && styles.tabActive]}
              onPress={() => setType('owner')}>
              <Text
                style={[
                  styles.tabText,
                  type === 'owner' && styles.tabTextActive,
                ]}>
                사장님용
              </Text>
            </Pressable>
          </View>

          {/* 회원가입 카드 */}
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                placeholder="앱에서 사용할 이름"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>생년월일</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                style={styles.input}
                placeholder="'-' 없이 숫자만 입력"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* 거주지 3단계 입력 */}
            <View style={styles.field}>
              <Text style={styles.label}>거주지</Text>
              <TextInput
                style={styles.input}
                placeholder="시/도 (예: 서울, 경기)"
                value={sido}
                onChangeText={setSido}
                autoCapitalize="words"
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="시/군/구 (예: 강남구)"
                value={sigungu}
                onChangeText={setSigungu}
                autoCapitalize="words"
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="읍/면/동 (예: 역삼동)"
                value={dong}
                onChangeText={setDong}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderSelector}>
                <Pressable
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('male')}>
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'male' && styles.genderButtonTextActive,
                    ]}>
                    남성
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('female')}>
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'female' && styles.genderButtonTextActive,
                    ]}>
                    여성
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="6자 이상 입력"
                secureTextEntry
                value={pw}
                onChangeText={setPw}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호 다시 입력"
                secureTextEntry
                value={pwConfirm}
                onChangeText={setPwConfirm}
              />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.signupBtn} onPress={handleSignup}>
              <Text style={styles.signupText}>
                {loading ? '처리 중...' : '회원가입 완료'}
              </Text>
            </Pressable>
          </View>

          {/* 로그인으로 돌아가기 */}
          <View style={styles.footerWrapper}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <Pressable onPress={goBackToLogin}>
              <Text style={styles.footerLink}>로그인으로 돌아가기</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 24 },

  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    padding: 4,
    borderRadius: 50,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },

  field: { marginBottom: 16 },
  label: { fontSize: 13, color: '#6b7280', marginBottom: 6 },

  input: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 14,
    color: '#1e293b',
  },

  genderSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  genderButtonText: {
    fontSize: 14,
    color: '#1e293b',
  },
  genderButtonTextActive: {
    fontWeight: '600',
  },

  signupBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 6,
  },
  signupText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },

  footerWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 4,
  },
  footerLink: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },

  error: { color: '#dc2626', marginBottom: 4 },
});