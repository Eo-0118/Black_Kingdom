// src/screens/AuthScreen.tsx
// 고객 사장 역할 및 로그인 화면
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

export default function AuthScreen() {
  const { login, setRole } = useAuth();
  const navigation = useNavigation();

  const [type, setType] = useState<'customer' | 'owner'>('customer');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email.includes('@')) return '이메일 형식이 올바르지 않습니다.';
    if (pw.length < 6) return '비밀번호는 6자 이상 입력해주세요.';
    return null;
  }

  async function handleLogin() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    const ok = await login(email, pw);
    setLoading(false);

    if (!ok) {
      setError('로그인에 실패했습니다.');
      return;
    }

    // 역할 저장
    setRole(type);
  }

  function goSignup() {
    navigation.navigate('Signup' as never);
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
                style={[styles.tabText, type === 'customer' && styles.tabTextActive]}
              >
                고객님용
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, type === 'owner' && styles.tabActive]}
              onPress={() => setType('owner')}
            >
              <Text
                style={[styles.tabText, type === 'owner' && styles.tabTextActive]}
              >
                사장님용
              </Text>
            </Pressable>
          </View>

          {/* 로그인 카드 */}
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                value={email}
                placeholder="you@example.com"
                autoCapitalize="none"
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={pw}
                placeholder="6자 이상 입력"
                onChangeText={setPw}
              />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginText}>
                {loading ? '처리 중...' : '로그인'}
              </Text>
            </Pressable>
          </View>

          {/* 회원가입 링크 */}
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
            <Pressable onPress={goSignup}>
              <Text style={styles.footerLink}>회원가입하기</Text>
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

  loginBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 6,
  },
  loginText: {
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