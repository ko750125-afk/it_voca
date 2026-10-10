import * as SQLite from 'expo-sqlite';
import termsData from '../data/terms.json';

// SDK 50+ (and 57) expo-sqlite synchronous API
export const db = SQLite.openDatabaseSync('itvoca.db');

export const initDB = async () => {
  // 카테고리 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  // 용어 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS Terms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      term TEXT NOT NULL,
      pronunciation TEXT NOT NULL,
      fullName TEXT,
      meaning TEXT NOT NULL,
      explanation TEXT NOT NULL,
      categoryId INTEGER,
      status INTEGER DEFAULT 0, -- 0: 노출, 1: 암기, 2: 암기 완료
      exposureCount INTEGER DEFAULT 0,
      isUserAdded INTEGER DEFAULT 0,
      isEdited INTEGER DEFAULT 0
    );
  `);

  // 설정 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS Settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // 기본 카테고리 시딩
  const categories = [
    { id: 1, name: 'AI · 인공지능' },
    { id: 2, name: '웹 개발' },
    { id: 3, name: '프로그래밍 기초' },
    { id: 4, name: '서버 · 네트워크' },
    { id: 5, name: '데이터베이스' },
    { id: 6, name: '개발 도구 · Git' },
    { id: 7, name: '클라우드 · 배포' },
    { id: 8, name: '보안 · 인증' }
  ];

  for (const cat of categories) {
    const existingCat = db.getFirstSync<{ id: number }>('SELECT id FROM Categories WHERE id = ?', [cat.id]);
    if (!existingCat) {
      db.runSync('INSERT INTO Categories (id, name) VALUES (?, ?)', [cat.id, cat.name]);
    }
  }

  // 초기 용어 데이터 시딩 (isUserAdded=0, isEdited=0 인 경우만 업데이트 또는 신규 삽입)
  for (const t of termsData) {
    const existing = db.getFirstSync<{ id: number, isEdited: number }>('SELECT id, isEdited FROM Terms WHERE id = ?', [t.id]);
    
    if (!existing) {
      // 신규 데이터 삽입
      db.runSync(`
        INSERT INTO Terms (id, term, pronunciation, fullName, meaning, explanation, categoryId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [t.id, t.term, t.pronunciation, t.fullName, t.meaning, t.explanation, t.categoryId]);
    } else if (existing.isEdited === 0) {
      // 편집되지 않은 기본 데이터는 앱 업데이트 시 최신 데이터로 덮어쓰기
      db.runSync(`
        UPDATE Terms 
        SET term=?, pronunciation=?, fullName=?, meaning=?, explanation=?, categoryId=?
        WHERE id = ?
      `, [t.term, t.pronunciation, t.fullName, t.meaning, t.explanation, t.categoryId, t.id]);
    }
  }

  // 기본 가리기 설정 시딩
  const defaultSettings = [
    { key: 'maskPronunciation', value: 'false' },
    { key: 'maskFullName', value: 'false' },
    { key: 'maskMeaning', value: 'false' },
    { key: 'maskExplanation', value: 'false' }
  ];

  for (const s of defaultSettings) {
    const existingSet = db.getFirstSync('SELECT key FROM Settings WHERE key = ?', [s.key]);
    if (!existingSet) {
      db.runSync('INSERT INTO Settings (key, value) VALUES (?, ?)', [s.key, s.value]);
    }
  }
};
