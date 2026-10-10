import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { getSettings, updateSetting, Settings } from '../database/crud';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleToggle = (key: keyof Settings) => {
    if (!settings) return;
    const newValue = !settings[key];
    updateSetting(key, newValue);
    setSettings({ ...settings, [key]: newValue });
  };

  if (!settings) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: '설정' }} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>학습 시 가리기 기본 설정</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>한글 발음 가리기</Text>
          <Switch 
            value={settings.maskPronunciation} 
            onValueChange={() => handleToggle('maskPronunciation')} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>원래 영어 (약자 풀네임) 가리기</Text>
          <Switch 
            value={settings.maskFullName} 
            onValueChange={() => handleToggle('maskFullName')} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>용어 뜻 가리기</Text>
          <Switch 
            value={settings.maskMeaning} 
            onValueChange={() => handleToggle('maskMeaning')} 
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>용어 해설 가리기</Text>
          <Switch 
            value={settings.maskExplanation} 
            onValueChange={() => handleToggle('maskExplanation')} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginLeft: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#333',
  }
});
