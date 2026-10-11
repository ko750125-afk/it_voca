import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Flashcard from '../components/Flashcard';
import { Term, Settings, getTerms, getSettings, updateTermStatus, incrementExposure } from '../database/crud';
import { playCardWhoosh, playButtonClick } from '../utils/sound';

const { width } = Dimensions.get('window');

export default function StudyScreen() {
  const { categoryId, categoryName } = useLocalSearchParams();
  const router = useRouter();
  
  const [terms, setTerms] = useState<Term[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    // Load terms (status 0 or 1)
    const allTerms = getTerms(Number(categoryId));
    const activeTerms = allTerms.filter(t => t.status !== 2);
    setTerms(activeTerms);
    setSettings(getSettings());
  }, [categoryId]);

  useEffect(() => {
    if (terms.length > 0 && terms[currentIndex]) {
      incrementExposure(terms[currentIndex].id);
    }
  }, [currentIndex, terms]);

  const handleNext = () => {
    playCardWhoosh();
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Alert.alert("학습 완료", "마지막 단어입니다.", [
        { text: "확인" }
      ]);
    }
  };

  const handlePrev = () => {
    playCardWhoosh();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleStatusChange = (newStatus: number) => {
    playButtonClick();
    if (terms.length === 0) return;
    const currentTerm = terms[currentIndex];
    updateTermStatus(currentTerm.id, newStatus);
    
    // Update local state
    const newTerms = [...terms];
    newTerms[currentIndex].status = newStatus;
    setTerms(newTerms);

    if (newStatus === 2) {
      // If completed, optionally move to next
      handleNext();
    }
  };

  if (!settings || terms.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Stack.Screen options={{ title: (categoryName as string) || '학습' }} />
        <Text style={styles.emptyText}>학습할 용어가 없습니다.</Text>
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => {
            playButtonClick();
            router.back();
          }}
        >
          <Text style={styles.btnText}>돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentTerm = terms[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: (categoryName as string) || '학습' }} />
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {terms.length}
        </Text>
      </View>

      <View style={styles.cardArea}>
        <Flashcard term={currentTerm} settings={settings} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.navBtn} onPress={handlePrev} disabled={currentIndex === 0}>
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.disabledText]}>이전</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navBtn} onPress={handleNext} disabled={currentIndex === terms.length - 1}>
          <Text style={[styles.navBtnText, currentIndex === terms.length - 1 && styles.disabledText]}>다음</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusControls}>
        {currentTerm.status === 0 && (
          <TouchableOpacity style={[styles.actionBtn, styles.memoBtn]} onPress={() => handleStatusChange(1)}>
            <Text style={styles.actionBtnText}>익숙해졌어요</Text>
          </TouchableOpacity>
        )}
        
        {currentTerm.status === 1 && (
          <>
            <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={() => handleStatusChange(0)}>
              <Text style={styles.actionBtnText}>다시 노출단계로</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.completeBtn]} onPress={() => handleStatusChange(2)}>
              <Text style={styles.actionBtnText}>암기 완료</Text>
            </TouchableOpacity>
          </>
        )}

        {currentTerm.status === 2 && (
          <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={() => handleStatusChange(1)}>
            <Text style={styles.actionBtnText}>암기 취소</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  emptyText: { fontSize: 18, marginBottom: 20 },
  progressContainer: { padding: 10, alignItems: 'center' },
  progressText: { fontSize: 16, color: '#666', fontWeight: 'bold' },
  cardArea: { flex: 1, justifyContent: 'center' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  navBtn: {
    padding: 10,
  },
  navBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  disabledText: {
    color: '#ccc',
  },
  statusControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    minWidth: 120,
    alignItems: 'center',
  },
  memoBtn: { backgroundColor: '#FF9500' },
  completeBtn: { backgroundColor: '#34C759' },
  resetBtn: { backgroundColor: '#8E8E93' },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
