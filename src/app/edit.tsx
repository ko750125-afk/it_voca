import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { saveUserTerm, Term, getCategories, Category } from '../database/crud';
import { db } from '../database/db';
import { playButtonClick } from '../utils/sound';

export default function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Term>>({
    term: '',
    pronunciation: '',
    fullName: '',
    meaning: '',
    explanation: '',
    categoryId: 1
  });

  useEffect(() => {
    setCategories(getCategories());
    
    if (id) {
      const term = db.getFirstSync<Term>('SELECT * FROM Terms WHERE id = ?', [Number(id)]);
      if (term) {
        setFormData(term);
      }
    }
  }, [id]);

  const handleSave = () => {
    playButtonClick();
    if (!formData.term || !formData.pronunciation || !formData.meaning) {
      Alert.alert('알림', '용어, 발음, 뜻은 필수 입력 항목입니다.');
      return;
    }
    
    saveUserTerm(formData);
    Alert.alert('완료', '저장되었습니다.', [
      { text: '확인', onPress: () => router.back() }
    ]);
  };

  const handleRestore = () => {
    playButtonClick();
    Alert.alert('경고', '기본 데이터로 복구하시겠습니까? 사용자 수정 내용이 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      { 
        text: '복구', 
        style: 'destructive',
        onPress: () => {
          if (id) {
            db.runSync('UPDATE Terms SET isEdited = 0 WHERE id = ?', [Number(id)]);
            Alert.alert('완료', '앱을 다시 시작하면 기본값으로 복구됩니다.', [
              { text: '확인', onPress: () => router.back() }
            ]);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: id ? '용어 수정' : '용어 추가' }} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>영어 용어 *</Text>
          <TextInput 
            style={styles.input} 
            value={formData.term} 
            onChangeText={t => setFormData({...formData, term: t})} 
            placeholder="예: API"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>한글 발음 *</Text>
          <TextInput 
            style={styles.input} 
            value={formData.pronunciation} 
            onChangeText={t => setFormData({...formData, pronunciation: t})} 
            placeholder="예: 에이피아이"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>원래 영어 (선택)</Text>
          <TextInput 
            style={styles.input} 
            value={formData.fullName} 
            onChangeText={t => setFormData({...formData, fullName: t})} 
            placeholder="예: Application Programming Interface"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>용어 뜻 *</Text>
          <TextInput 
            style={styles.input} 
            value={formData.meaning} 
            onChangeText={t => setFormData({...formData, meaning: t})} 
            placeholder="예: 프로그램 간 연결 규칙"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>용어 해설</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={formData.explanation} 
            onChangeText={t => setFormData({...formData, explanation: t})} 
            multiline
            placeholder="상세한 설명을 입력하세요"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>저장하기</Text>
        </TouchableOpacity>

        {id && (
          <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
            <Text style={styles.restoreBtnText}>기본 내용으로 복원</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scroll: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  restoreBtn: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  restoreBtnText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }
});
