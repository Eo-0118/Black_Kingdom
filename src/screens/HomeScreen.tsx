// src/screens/HomeScreen.tsx
//B2B 고객용 화면
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StoreItem = {
  id: string;
  name: string;
  area: string;
  category: string;
};

const MOCK_STORES: StoreItem[] = [
  { id: '1', name: '블랙킹덤 연남점', area: '서울 · 마포구', category: '한식 / 밥집' },
  { id: '2', name: '블랙킹덤 강남점', area: '서울 · 강남구', category: '퓨전 / 다이닝' },
  { id: '3', name: '블랙킹덤 홍대점', area: '서울 · 마포구', category: '펍 / 술집' },
];

function StoreCard({ item }: { item: StoreItem }) {
  return (
    <Pressable style={styles.card} android_ripple={{ color: '#e5e7eb' }}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardCategory}>{item.category}</Text>
      <Text style={styles.cardArea}>{item.area}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.logo}>BLACK KINGDOM</Text>
        <Text style={styles.subtitle}>고객용 (B2B) 리스트</Text>
      </View>

      <FlatList
        data={MOCK_STORES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <StoreCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6', // 살짝 밝은 회색 배경
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#f3f4f6',
  },
  logo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    // 그림자 (android)
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardArea: {
    fontSize: 12,
    color: '#9ca3af',
  },
});