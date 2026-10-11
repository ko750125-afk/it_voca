import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Term, updateTermStatus } from '../database/crud';
import { db } from '../database/db';
import { playButtonClick } from '../utils/sound';

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [term, setTerm] = useState<Term | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  const loadTerm = useCallback(() => {
    if (!id) return;
    const termData = db.getFirstSync<Term>('SELECT * FROM Terms WHERE id = ?', [Number(id)]);
    if (termData) {
      setTerm(termData);
      const cat = db.getFirstSync<{ name: string }>('SELECT name FROM Categories WHERE id = ?', [termData.categoryId]);
      if (cat) setCategoryName(cat.name);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadTerm();
    }, [loadTerm])
  );

  const handleStatusChange = (newStatus: number) => {
    if (!term) return;
    playButtonClick();
    updateTermStatus(term.id, newStatus);
    setTerm({ ...term, status: newStatus });
  };

  if (!term) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Stack.Screen options={{ title: '용어 상세' }} />
        <Text style={styles.notFoundText}>용어를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const statusLabel = term.status === 2 ? '암기 완료' : term.status === 1 ? '암기 단계' : '노출 단계';
  const statusBadgeStyle = term.status === 2 ? styles.badgeCompleted : term.status === 1 ? styles.badgeMemo : styles.badgeExposure;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: term.term }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Meta Tags */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryName || 'IT 용어'}</Text>
          </View>
          <View style={[styles.statusBadge, statusBadgeStyle]}>
            <Text style={styles.statusBadgeText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Term & Pronunciation Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.termTitle}>{term.term}</Text>
          <Text style={styles.pronunciationText}>{term.pronunciation}</Text>
          {term.fullName ? (
            <View style={styles.fullNameContainer}>
              <Text style={styles.fullNameLabel}>풀네임</Text>
              <Text style={styles.fullNameText}>{term.fullName}</Text>
            </View>
          ) : null}
        </View>

        {/* Meaning Box */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>용어 뜻</Text>
          <Text style={styles.meaningText}>{term.meaning}</Text>
        </View>

        {/* Explanation Box */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>상세 해설</Text>
          <Text style={styles.explanationText}>{term.explanation}</Text>
        </View>

        {/* Learning Status Manager */}
        <View style={styles.statusManageSection}>
          <View style={styles.statusSectionHeaderRow}>
            <Text style={styles.sectionHeader}>학습 상태 변경</Text>
            <Text style={styles.exposureCountText}>노출 {term.exposureCount}회</Text>
          </View>
          <View style={styles.statusButtonsRow}>
            <TouchableOpacity 
              style={[styles.statusBtn, term.status === 0 && styles.statusBtnActiveExposure]}
              onPress={() => handleStatusChange(0)}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusBtnText, term.status === 0 && styles.statusBtnTextActive]}>
                1단계 노출
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statusBtn, term.status === 1 && styles.statusBtnActiveMemo]}
              onPress={() => handleStatusChange(1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusBtnText, term.status === 1 && styles.statusBtnTextActive]}>
                2단계 암기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statusBtn, term.status === 2 && styles.statusBtnActiveCompleted]}
              onPress={() => handleStatusChange(2)}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusBtnText, term.status === 2 && styles.statusBtnTextActive]}>
                3단계 완료
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => {
              playButtonClick();
              router.push({ pathname: '/edit', params: { id: term.id } });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.editBtnText}>✏️ 용어 내용 수정하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f7fb',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b5bdb',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeExposure: {
    backgroundColor: '#edf2f7',
  },
  badgeMemo: {
    backgroundColor: '#fff4e5',
  },
  badgeCompleted: {
    backgroundColor: '#e6fcf5',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#495057',
  },
  heroSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  termTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1a1a24',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  pronunciationText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#007AFF',
    marginTop: 8,
    textAlign: 'center',
  },
  fullNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  fullNameLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#868e96',
    marginRight: 6,
  },
  fullNameText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  cardSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#868e96',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  meaningText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    lineHeight: 26,
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#343a40',
  },
  statusManageSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statusSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exposureCountText: {
    fontSize: 12,
    color: '#868e96',
    fontWeight: '600',
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
  },
  statusBtnActiveExposure: {
    backgroundColor: '#495057',
  },
  statusBtnActiveMemo: {
    backgroundColor: '#f59f00',
  },
  statusBtnActiveCompleted: {
    backgroundColor: '#2b8a3e',
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#868e96',
  },
  statusBtnTextActive: {
    color: '#ffffff',
  },
  actionRow: {
    marginTop: 4,
  },
  editBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF',
  },
});
