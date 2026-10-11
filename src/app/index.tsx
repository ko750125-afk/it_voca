import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getCategoryStats, getTotalStats, CategoryStat } from '../database/crud';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalCount: 0, exposureCount: 0, memoCount: 0, completedCount: 0 });
  const [categories, setCategories] = useState<CategoryStat[]>([]);

  useFocusEffect(
    useCallback(() => {
      setStats(getTotalStats());
      setCategories(getCategoryStats());
    }, [])
  );

  const totalProgress = stats.totalCount > 0 
    ? Math.round((stats.completedCount / stats.totalCount) * 100) 
    : 0;

  const renderCategory = ({ item }: { item: CategoryStat }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({ pathname: '/study', params: { categoryId: item.id, categoryName: item.name } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardProgressText}>{item.progress}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
      </View>
      <Text style={styles.cardSubText}>
        {item.completedCount} / {item.totalCount} 완료
      </Text>
      {item.progress === 100 && (
        <Text style={styles.celebrationText}>🎉 마스터했습니다!</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>전체 학습 현황</Text>
        <Text style={styles.totalProgress}>{totalProgress}% 암기 완료</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statItem}>노출: {stats.exposureCount}</Text>
          <Text style={styles.statItem}>암기: {stats.memoCount}</Text>
          <Text style={styles.statItem}>완료: {stats.completedCount}</Text>
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/list')}>
          <Text style={styles.navButtonText}>전체 단어장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/settings')}>
          <Text style={styles.navButtonText}>설정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  totalProgress: { fontSize: 32, fontWeight: '900', color: '#007AFF', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 15 },
  statItem: { fontSize: 14, color: '#666' },
  list: { padding: 15, gap: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardProgressText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  progressBarBg: { height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#007AFF' },
  cardSubText: { fontSize: 13, color: '#888' },
  celebrationText: { fontSize: 13, color: '#FF9500', fontWeight: 'bold', marginTop: 8 },
  bottomNav: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  navButton: { flex: 1, padding: 15, alignItems: 'center' },
  navButtonText: { fontSize: 16, fontWeight: '600', color: '#333' }
});
