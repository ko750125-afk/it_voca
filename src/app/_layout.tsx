import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { initDB } from '../database/db';

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setupDB = async () => {
      try {
        await initDB();
      } catch (error) {
        console.error('DB Initialization failed:', error);
      } finally {
        setDbInitialized(true);
      }
    };
    setupDB();
  }, []);

  if (!dbInitialized) {
    return null; // Or a splash screen
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '홈' }} />
      <Stack.Screen name="study" options={{ title: '학습', headerBackTitle: '뒤로' }} />
      <Stack.Screen name="list" options={{ title: '단어장', headerBackTitle: '뒤로' }} />
      <Stack.Screen name="settings" options={{ title: '설정', headerBackTitle: '뒤로' }} />
    </Stack>
  );
}
