import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { getTerms, Term } from '../database/crud';

export default function ListScreen() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [filter, setFilter] = useState(-1); // -1: All, 0: Exposure, 1: Memo, 2: Completed

  useEffect(() => {
    // getTerms API handles statusFilter if provided
    setTerms(getTerms(0, filter));
  }, [filter]);

  const renderItem = ({ item }: { item: Term }) => (
    <TouchableOpacity 
      style={styles.itemRow}
      onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemTerm}>{item.term}</Text>
        <Text style={styles.itemMeaning}>{item.meaning}</Text>
      </View>
      <View style={[styles.statusBadge, item.status === 2 ? styles.statusCompleted : item.status === 1 ? styles.statusMemo : styles.statusExposure]}>
        <Text style={styles.statusText}>
          {item.status === 2 ? '완료' : item.status === 1 ? '암기' : '노출'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: '단어장' }} />
      
      <View style={styles.filterRow}>
        {[-1, 0, 1, 2].map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === -1 ? '전체' : f === 0 ? '노출' : f === 1 ? '암기' : '완료'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={terms}
        keyExtractor={t => t.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  filterRow: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: { padding: 15 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemInfo: { flex: 1 },
  itemTerm: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemMeaning: { fontSize: 14, color: '#666' },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusExposure: { backgroundColor: '#e5e5ea' },
  statusMemo: { backgroundColor: '#ffecc0' },
  statusCompleted: { backgroundColor: '#d4edda' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#333' }
});
