import { db } from './db';

export interface Category {
  id: number;
  name: string;
}

export interface CategoryStat extends Category {
  totalCount: number;
  completedCount: number;
  progress: number;
}

export interface Term {
  id: number;
  term: string;
  pronunciation: string;
  fullName: string;
  meaning: string;
  explanation: string;
  categoryId: number;
  status: number;
  exposureCount: number;
  isUserAdded: number;
  isEdited: number;
}

export interface Settings {
  maskPronunciation: boolean;
  maskFullName: boolean;
  maskMeaning: boolean;
  maskExplanation: boolean;
}

// ----------------- 카테고리 & 통계 -----------------

export const getCategoryStats = (): CategoryStat[] => {
  const query = `
    SELECT 
      c.id, 
      c.name, 
      COUNT(t.id) as totalCount, 
      SUM(CASE WHEN t.status = 2 THEN 1 ELSE 0 END) as completedCount
    FROM Categories c
    LEFT JOIN Terms t ON c.id = t.categoryId
    GROUP BY c.id
  `;
  
  const results = db.getAllSync<{id: number, name: string, totalCount: number, completedCount: number}>(query);
  
  return results.map(r => ({
    ...r,
    progress: r.totalCount > 0 ? Math.round((r.completedCount / r.totalCount) * 100) : 0
  }));
};

export const getTotalStats = () => {
  const query = `
    SELECT 
      COUNT(id) as totalCount,
      SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as exposureCount,
      SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as memoCount,
      SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as completedCount
    FROM Terms
  `;
  return db.getFirstSync<{totalCount: number, exposureCount: number, memoCount: number, completedCount: number}>(query) || {
    totalCount: 0, exposureCount: 0, memoCount: 0, completedCount: 0
  };
};

export const getCategories = (): Category[] => {
  return db.getAllSync<Category>('SELECT * FROM Categories');
};

// ----------------- 용어 -----------------

export const getTerms = (categoryId?: number, statusFilter?: number): Term[] => {
  let query = 'SELECT * FROM Terms WHERE 1=1';
  const params: any[] = [];
  
  if (categoryId !== undefined && categoryId !== 0) { // 0 means 'All'
    query += ' AND categoryId = ?';
    params.push(categoryId);
  }
  
  if (statusFilter !== undefined && statusFilter !== -1) { // -1 means 'All'
    query += ' AND status = ?';
    params.push(statusFilter);
  } else if (statusFilter === undefined || statusFilter === -1) {
    // 기본적으로 암기 완료(2)는 제외하되 필터가 명시적이면 포함 (ui 단에서 처리 가능, 여기선 그냥 다 줌)
  }
  
  return db.getAllSync<Term>(query, params);
};

export const updateTermStatus = (id: number, status: number) => {
  db.runSync('UPDATE Terms SET status = ? WHERE id = ?', [status, id]);
};

export const incrementExposure = (id: number) => {
  db.runSync('UPDATE Terms SET exposureCount = exposureCount + 1 WHERE id = ?', [id]);
};

export const saveUserTerm = (termData: Partial<Term> & { id?: number }) => {
  if (termData.id) {
    db.runSync(`
      UPDATE Terms 
      SET term=?, pronunciation=?, fullName=?, meaning=?, explanation=?, categoryId=?, isEdited=1
      WHERE id = ?
    `, [
      termData.term, termData.pronunciation, termData.fullName, 
      termData.meaning, termData.explanation, termData.categoryId, termData.id
    ]);
  } else {
    db.runSync(`
      INSERT INTO Terms (term, pronunciation, fullName, meaning, explanation, categoryId, isUserAdded, isEdited)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    `, [
      termData.term, termData.pronunciation, termData.fullName, 
      termData.meaning, termData.explanation, termData.categoryId
    ]);
  }
};

// ----------------- 설정 -----------------

export const getSettings = (): Settings => {
  const results = db.getAllSync<{key: string, value: string}>('SELECT * FROM Settings');
  const s: any = {
    maskPronunciation: false,
    maskFullName: false,
    maskMeaning: false,
    maskExplanation: false
  };
  for (const r of results) {
    s[r.key] = r.value === 'true';
  }
  return s as Settings;
};

export const updateSetting = (key: string, value: boolean) => {
  db.runSync('UPDATE Settings SET value = ? WHERE key = ?', [value ? 'true' : 'false', key]);
};
