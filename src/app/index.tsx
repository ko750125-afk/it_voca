import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getCategoryStats, getTotalStats, CategoryStat, getLastStudy, LastStudyInfo } from '../database/crud';
import { playButtonClick } from '../utils/sound';

const appIconSource = require('../../assets/images/app-icon.png');
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalCount: 0, exposureCount: 0, memoCount: 0, completedCount: 0 });
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [lastStudy, setLastStudy] = useState<LastStudyInfo | null>(null);

  useFocusEffect(
    useCallback(() => {
      setStats(getTotalStats());
      setCategories(getCategoryStats());
      setLastStudy(getLastStudy());
    }, [])
  );

  const totalProgress = stats.totalCount > 0 
    ? Math.round((stats.completedCount / stats.totalCount) * 100) 
    : 0;

  const navigateWithSound = (action: () => void) => {
    playButtonClick();
    action();
  };

  const handleResumeStudy = () => {
    navigateWithSound(() => {
      if (lastStudy) {
        router.push({
          pathname: '/study',
          params: {
            categoryId: lastStudy.categoryId,
            categoryName: lastStudy.categoryName,
            statusFilter: lastStudy.statusFilter !== undefined ? lastStudy.statusFilter : '',
            targetTermId: lastStudy.termId,
          }
        });
      } else {
        router.push({
          pathname: '/study',
          params: { categoryId: 0, categoryName: '전체 통합 학습' }
        });
      }
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Hero Banner with Selected Icon */}
      <View style={styles.heroBanner}>
        <Image source={appIconSource} style={styles.heroIcon} />
        <View style={styles.heroContent}>
          <Text style={styles.heroAppTitle}>IT Voca</Text>
          <Text style={styles.heroSubtitle}>
            {lastStudy 
              ? `최근 학습: ${lastStudy.termName} (${lastStudy.categoryName})` 
              : '바이브코딩 핵심 용어 플래시카드'}
          </Text>
          <TouchableOpacity 
            style={styles.heroStartBtn}
            onPress={handleResumeStudy}
            activeOpacity={0.8}
          >
            <Text style={styles.heroStartBtnText}>
              {lastStudy ? '▶ 지난 학습 이어서 하기' : '▶ 첫 학습 시작하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Shortcuts */}
      <Text style={styles.sectionTitle}>바로가기</Text>
      <View style={styles.shortcutsGrid}>

        <TouchableOpacity 
          style={styles.shortcutCard} 
          onPress={() => navigateWithSound(() => router.push('/list'))}
        >
          <Text style={styles.shortcutEmoji}>📚</Text>
          <Text style={styles.shortcutLabel}>전체 단어장</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.shortcutCard} 
          onPress={() => navigateWithSound(() => router.push('/edit'))}
        >
          <Text style={styles.shortcutEmoji}>➕</Text>
          <Text style={styles.shortcutLabel}>단어 추가</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.shortcutCard} 
          onPress={() => navigateWithSound(() => router.push('/settings'))}
        >
          <Text style={styles.shortcutEmoji}>⚙️</Text>
          <Text style={styles.shortcutLabel}>학습 설정</Text>
        </TouchableOpacity>
      </View>

      {/* Learning Status Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>전체 암기 성취도</Text>
          <Text style={styles.statsPercent}>{totalProgress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${totalProgress}%` }]} />
        </View>
        <View style={styles.statsBadgeRow}>
          <View style={[styles.badge, styles.badgeExposure]}>
            <Text style={styles.badgeText}>노출 {stats.exposureCount}개</Text>
          </View>
          <View style={[styles.badge, styles.badgeMemo]}>
            <Text style={styles.badgeText}>암기중 {stats.memoCount}개</Text>
          </View>
          <View style={[styles.badge, styles.badgeDone]}>
            <Text style={styles.badgeText}>완료 {stats.completedCount}개</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>주제별 학습</Text>
    </View>
  );

  const renderCategory = ({ item }: { item: CategoryStat }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigateWithSound(() => router.push({ pathname: '/study', params: { categoryId: item.id, categoryName: item.name } }))}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{item.name}</Text>
        <Text style={styles.categoryProgressText}>{item.progress}%</Text>
      </View>
      <View style={styles.categoryProgressBg}>
        <View style={[styles.categoryProgressFill, { width: `${item.progress}%` }]} />
      </View>
      <View style={styles.categoryFooter}>
        <Text style={styles.categorySubText}>
          {item.completedCount} / {item.totalCount} 암기 완료
        </Text>
        {item.progress === 100 && (
          <Text style={styles.celebrationText}>🎉 마스터</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategory}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f6f9' 
  },
  listContent: { 
    padding: 16, 
    paddingBottom: 40 
  },
  headerContainer: { 
    marginBottom: 8 
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroIcon: {
    width: 74,
    height: 74,
    borderRadius: 18,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e8edf5',
  },
  heroContent: {
    flex: 1,
  },
  heroAppTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a24',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#71788e',
    marginTop: 2,
    marginBottom: 10,
  },
  heroStartBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  heroStartBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a24',
    marginBottom: 12,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  shortcutEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34384a',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555b70',
  },
  statsPercent: {
    fontSize: 28,
    fontWeight: '900',
    color: '#007AFF',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#edf0f7',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  statsBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeExposure: {
    backgroundColor: '#f0f2f7',
  },
  badgeMemo: {
    backgroundColor: '#fff4e5',
  },
  badgeDone: {
    backgroundColor: '#eaf7ed',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#495066',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a24',
  },
  categoryProgressText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#007AFF',
  },
  categoryProgressBg: {
    height: 6,
    backgroundColor: '#edf0f7',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySubText: {
    fontSize: 12,
    color: '#82899f',
  },
  celebrationText: {
    fontSize: 12,
    color: '#34c759',
    fontWeight: '800',
  },
});
