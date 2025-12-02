

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
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const { signup, setRole } = useAuth();
  const navigation = useNavigation();

  const [type, setType] = useState<'customer' | 'owner'>('customer');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [dong, setDong] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email.includes('@')) return '이메일 형식이 올바르지 않습니다.';
    if (pw.length < 6) return '비밀번호는 6자 이상 입력해주세요.';
    if (pw !== pwConfirm) return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    if (!nickname.trim()) return '닉네임을 입력해주세요.';
    if (!phone_number.trim()) return '전화번호를 입력해주세요.';
    if (!date_of_birth.trim()) return '생년월일을 입력해주세요.';
    if (!sido.trim()) return '시/도를 입력해주세요.';
    if (!sigungu.trim()) return '시/군/구를 입력해주세요.';
    if (!dong.trim()) return '동을 입력해주세요.';
    if (!gender.trim()) return '성별을 입력해주세요.';
    return null;
  }

  async function handleSignup() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    const ok = await signup({
      email,
      password: pw,
      nickname,
      phone_number,
      date_of_birth,
      sido,
      sigungu,
      dong,
      gender,
    });
    setLoading(false);

    if (!ok) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // 회원가입 성공 시, 로그인 화면으로 돌아가기
    navigation.goBack();
  }

  function goBackToLogin() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* 상단 역할 탭 */}
          <View style={styles.tabWrapper}>
            <Pressable
              style={[styles.tab, type === 'customer' && styles.tabActive]}
              onPress={() => setType('customer')}
            >
              <Text
                style={[
                  styles.tabText,
                  type === 'customer' && styles.tabTextActive,
                ]}
              >
                고객님용
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, type === 'owner' && styles.tabActive]}
              onPress={() => setType('owner')}
            >
              <Text
                style={[
                  styles.tabText,
                  type === 'owner' && styles.tabTextActive,
                ]}
              >
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
                textContentType="nickname"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                style={styles.input}
                placeholder="- 없이 숫자만 입력"
                value={phone_number}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>생년월일</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={date_of_birth}
                onChangeText={setDateOfBirth}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>시/도</Text>
              <TextInput
                style={styles.input}
                placeholder="서울특별시"
                value={sido}
                onChangeText={setSido}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>시/군/구</Text>
              <TextInput
                style={styles.input}
                placeholder="강남구"
                value={sigungu}
                onChangeText={setSigungu}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>동</Text>
              <TextInput
                style={styles.input}
                placeholder="역삼동"
                value={dong}
                onChangeText={setDong}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>성별</Text>
              <TextInput
                style={styles.input}
                placeholder="남/여"
                value={gender}
                onChangeText={setGender}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                textContentType="emailAddress"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="6자 이상 입력"
                secureTextEntry
                textContentType="none"
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
                textContentType="none"
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
          <View style={{ marginTop: 16, alignItems: 'center' }}>
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
  scroll: { paddingHorizontal: 20, paddingTop: 40 },

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