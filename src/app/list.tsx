import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { getTerms, getCategories, Term, Category } from '../database/crud';
import { playButtonClick, playCardWhoosh } from '../utils/sound';

export default function ListScreen() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // 0 = 전체 속성
  const [selectedStatus, setSelectedStatus] = useState<number>(-1); // -1 = 전체, 0 = 노출, 1 = 암기, 2 = 완료

  const loadData = useCallback(() => {
    setCategories(getCategories());
    setTerms(getTerms(selectedCategory, selectedStatus));
  }, [selectedCategory, selectedStatus]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 현재 필터에 따른 복습 타이틀 생성
  const getReviewTitle = () => {
    const catName = selectedCategory === 0 ? '전체' : (categories.find(c => c.id === selectedCategory)?.name || '주제');
    let statusName = '통합';
    if (selectedStatus === 0) statusName = '노출';
    else if (selectedStatus === 1) statusName = '암기';
    else if (selectedStatus === 2) statusName = '완료';

    return `${catName} · ${statusName} 복습`;
  };

  const handleStartReview = () => {
    if (terms.length === 0) return;
    playCardWhoosh();
    router.push({
      pathname: '/study',
      params: {
        categoryId: selectedCategory,
        statusFilter: selectedStatus,
        categoryName: getReviewTitle(),
      }
    });
  };

  const renderItem = ({ item }: { item: Term }) => {
    const catName = categories.find(c => c.id === item.categoryId)?.name;
    const statusText = item.status === 2 ? '완료' : item.status === 1 ? '암기' : '노출';
    const statusStyle = item.status === 2 ? styles.badgeCompleted : item.status === 1 ? styles.badgeMemo : styles.badgeExposure;

    return (
      <TouchableOpacity 
        style={styles.itemRow}
        onPress={() => {
          playButtonClick();
          router.push({ pathname: '/detail', params: { id: item.id } });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.itemInfo}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemTerm}>{item.term}</Text>
            {catName ? <Text style={styles.itemCatTag}>{catName}</Text> : null}
          </View>
          <Text style={styles.itemMeaning} numberOfLines={1}>{item.meaning}</Text>
        </View>

        <View style={[styles.statusBadge, statusStyle]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: '전체 단어장' }} />

      {/* 1. 속성(카테고리) 가로 스크롤 필터 */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          <TouchableOpacity 
            style={[styles.categoryChip, selectedCategory === 0 && styles.categoryChipActive]}
            onPress={() => {
              playButtonClick();
              setSelectedCategory(0);
            }}
          >
            <Text style={[styles.categoryChipText, selectedCategory === 0 && styles.categoryChipTextActive]}>
              전체 속성
            </Text>
          </TouchableOpacity>

          {categories.map(c => (
            <TouchableOpacity 
              key={c.id} 
              style={[styles.categoryChip, selectedCategory === c.id && styles.categoryChipActive]}
              onPress={() => {
                playButtonClick();
                setSelectedCategory(c.id);
              }}
            >
              <Text style={[styles.categoryChipText, selectedCategory === c.id && styles.categoryChipTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2. 상태(노출/암기/완료) 세그먼트 필터 */}
      <View style={styles.statusFilterRow}>
        {[
          { key: -1, label: '전체 상태' },
          { key: 0, label: '노출' },
          { key: 1, label: '암기' },
          { key: 2, label: '완료' },
        ].map(s => (
          <TouchableOpacity 
            key={s.key} 
            style={[styles.statusFilterBtn, selectedStatus === s.key && styles.statusFilterBtnActive]}
            onPress={() => {
              playButtonClick();
              setSelectedStatus(s.key);
            }}
          >
            <Text style={[styles.statusFilterText, selectedStatus === s.key && styles.statusFilterTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. 복습 액션 배너 */}
      <View style={styles.reviewBannerWrapper}>
        <TouchableOpacity 
          style={[styles.reviewActionBtn, terms.length === 0 && styles.reviewActionBtnDisabled]}
          onPress={handleStartReview}
          disabled={terms.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.reviewActionText}>
            ⚡ {selectedStatus === 0 ? '노출 카드만 복습하기' : selectedStatus === 1 ? '암기 카드만 복습하기' : selectedStatus === 2 ? '완료 카드 다시보기' : '선택한 조건으로 복습하기'} ({terms.length}개)
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. 용어 목록 */}
      <FlatList
        data={terms}
        keyExtractor={t => t.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 조건의 단어가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f6f9' 
  },
  categoryFilterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#f0f2f5',
    paddingVertical: 10,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f3f6',
  },
  categoryChipActive: {
    backgroundColor: '#1a1a24',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#656b7c',
  },
  categoryChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  statusFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 8,
  },
  statusFilterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f3f6',
    alignItems: 'center',
  },
  statusFilterBtnActive: {
    backgroundColor: '#007AFF',
  },
  statusFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6c7280',
  },
  statusFilterTextActive: {
    color: '#ffffff',
  },
  reviewBannerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewActionBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  reviewActionBtnDisabled: {
    backgroundColor: '#ccd2dc',
    shadowOpacity: 0,
    elevation: 0,
  },
  reviewActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  listContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 30,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1.5,
  },
  itemInfo: { 
    flex: 1,
    marginRight: 12,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  itemTerm: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#1a1a24' 
  },
  itemCatTag: {
    fontSize: 11,
    color: '#007AFF',
    backgroundColor: '#edf5ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
  },
  itemMeaning: { 
    fontSize: 13, 
    color: '#6c7280',
    lineHeight: 18,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  badgeExposure: { 
    backgroundColor: '#edf2f7' 
  },
  badgeMemo: { 
    backgroundColor: '#fff4e5' 
  },
  badgeCompleted: { 
    backgroundColor: '#e6fcf5' 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#495057' 
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8e8e93',
  },
});
