import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ShopDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Receive params from the previous screen (e.g., CustomerHomeScreen)
  const { placeId, name, address, distance, waiting, tag } = route.params || {
    placeId: 0,
    name: '매장 정보 없음',
    address: '주소 정보 없음',
  };

  const handleReservePress = () => {
    // Navigate to the reservation creation screen, passing all necessary params
    navigation.navigate('CustomerCreateReservation', {
      placeId,
      name,
      address,
      distance,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>
        {/* Header with Back Button */}
        <View style={styles.headerBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        </View>

        {/* Shop Info */}
        <View style={styles.infoContainer}>
          {tag && <Text style={styles.tag}>{tag}</Text>}
          <Text style={styles.shopName}>{name}</Text>
          <Text style={styles.shopAddress}>{address}</Text>
          <View style={styles.metaRow}>
            {distance && <Text style={styles.metaText}>거리: {distance}</Text>}
            {waiting && <Text style={styles.metaText}>대기: {waiting}</Text>}
          </View>
        </View>

        {/* Dummy content for shop details */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>매장 설명</Text>
          <Text style={styles.sectionBody}>
            이곳은 '{name}'의 상세 설명이 들어갈 자리입니다. 최고급 재료만을
            사용하여 고객님께 최상의 경험을 선사합니다.
          </Text>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>메뉴 정보</Text>
          <Text style={styles.sectionBody}>
            {`- 스페셜 코스: 120,000원
- 디너 코스: 80,000원
- 와인 페어링: 50,000원`}
          </Text>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>방문자 리뷰</Text>
          <Text style={styles.sectionBody}>
            "분위기가 너무 좋았어요! 음식도 맛있고, 특별한 날에 오기 좋은 곳입니다."
            - 김**
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.footer}>
        <Pressable style={styles.reserveButton} onPress={handleReservePress}>
          <Text style={styles.reserveButtonText}>예약하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  headerBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: -2,
  },
  infoContainer: {
    backgroundColor: '#111827',
    padding: 20,
    paddingTop: 60,
  },
  tag: {
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  contentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  reserveButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
