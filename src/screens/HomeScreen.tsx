// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Shop = {
  id: string;
  name: string;
  address: string;
  distance: string;
  waiting: string;
  tag?: string;
};

const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: '블랙킹덤 ○○지점',
    address: '서울시 어딘가 123',
    distance: '320m',
    waiting: '대기 3팀',
    tag: '오늘의 추천',
  },
  {
    id: '2',
    name: '헤어킹 살롱',
    address: '서울시 어딘가 45',
    distance: '1.2km',
    waiting: '대기 1팀',
    tag: '예약 가능',
  },
  {
    id: '3',
    name: '바버샵 클래식',
    address: '서울시 어딘가 89',
    distance: '800m',
    waiting: '바로 이용 가능',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'near' | 'wait'>(
    'all',
  );

  function handleSearch() {
    // TODO: 나중에 서버 연동 시 실제 검색 API 호출
    console.log('search:', keyword);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
              <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
              >
                {/* 뒤로가기 버튼 */}
                <View style={styles.headerBackContainer}>
                  <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>‹</Text>
                  </Pressable>
                </View>
      
                {/* 상단 헤더 */}
                <View style={styles.header}>
                  <Text style={styles.logo}>BLACK KINGDOM</Text>
                  <Text style={styles.subtitle}>가까운 매장과 대기 현황을 확인해보세요.</Text>
                </View>
        {/* 검색 영역 */}
        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="매장명, 지역명으로 검색"
            placeholderTextColor="#9ca3af"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <Pressable style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>검색</Text>
          </Pressable>
        </View>

        {/* 필터 탭 */}
        <View style={styles.filterRow}>
          <FilterChip
            label="전체"
            active={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
          />
          <FilterChip
            label="가까운 순"
            active={selectedFilter === 'near'}
            onPress={() => setSelectedFilter('near')}
          />
          <FilterChip
            label="대기 적은 순"
            active={selectedFilter === 'wait'}
            onPress={() => setSelectedFilter('wait')}
          />
        </View>

        {/* 매장 리스트 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>내 주변 매장</Text>
          <Text style={styles.sectionCount}>{MOCK_SHOPS.length}개</Text>
        </View>

        {MOCK_SHOPS.map(shop => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({
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

function ShopCard({ shop }: { shop: Shop }) {
  const navigation = useNavigation<any>();

  function openDetail() {
    navigation.navigate('ShopDetail', {
      name: shop.name,
      address: shop.address,
      distance: shop.distance,
      waiting: shop.waiting,
      tag: shop.tag,
    });
  }

  return (
    <Pressable style={styles.shopCard} onPress={openDetail}>
      {/* 기존 내용 그대로 */}
      <View style={styles.shopMainRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <Text style={styles.shopAddress}>{shop.address}</Text>
          <Text style={styles.shopDistance}>{shop.distance}</Text>
        </View>
        <View style={styles.waitBadge}>
          <Text style={styles.waitText}>{shop.waiting}</Text>
        </View>
      </View>

      {shop.tag && (
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{shop.tag}</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.footerHint}>상세 보기 · 예약하기</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerBackContainer: {
    paddingHorizontal: 20, // Match scroll padding
    paddingTop: 12,
    paddingBottom: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    color: '#111827',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingRight: 8,
    color: '#111827',
  },
  searchButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  searchButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
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
    color: '#ffffff',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCount: {
    marginLeft: 6,
    fontSize: 12,
    color: '#9ca3af',
  },
  shopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  shopMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  shopAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  shopDistance: {
    fontSize: 11,
    color: '#9ca3af',
  },
  waitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    marginLeft: 8,
  },
  waitText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  tagBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
  },
  tagText: {
    fontSize: 11,
    color: '#4f46e5',
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 8,
  },
  footerHint: {
    fontSize: 11,
    color: '#9ca3af',
  },
});