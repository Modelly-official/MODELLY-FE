/**
 * IndexedDB 유틸리티
 * Service Worker에서 userRole 접근을 위해 사용
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
const DB_NAME = 'moandi-sw';
const STORE_NAME = 'user-info';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    // 다른 탭에서 이전 버전의 DB를 사용 중일 때
    request.onblocked = () => {
      console.warn('[IndexedDB] Database blocked - close other tabs');
    };

    // 최초 생성 또는 버전 업그레이드 시
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveUserRoleToIDB(role: 'model' | 'designer'): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(role, 'userRole');

    request.onerror = () => reject(request.error);

    tx.oncomplete = () => {
      db.close(); // 연결 해제
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getUserRoleFromIDB(): Promise<'model' | 'designer' | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('userRole');

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => {
      db.close(); // 연결 해제
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function clearUserRoleFromIDB(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete('userRole');

    request.onerror = () => reject(request.error);

    tx.oncomplete = () => {
      db.close(); // 연결 해제
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
