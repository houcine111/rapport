import { openDB } from 'idb';

const DB_NAME = 'offlineSalesDB';
const STORE_NAME = 'sales';
const STOCKS_STORE = 'stocks';

export async function initDB() {
  return openDB(DB_NAME, 8, {  // <-- incrémenter la version ici
    upgrade(db) {
      // Création store ventes
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const salesStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        salesStore.createIndex('isSynced', 'isSynced', { unique: false });
      }

      // Création store stocks
      if (!db.objectStoreNames.contains(STOCKS_STORE)) {
        const stockStore = db.createObjectStore(STOCKS_STORE, { keyPath: 'stockId' });
        stockStore.createIndex('produitNom', 'produitNom', { unique: false });
      }
    }
  });
}

export async function saveStocks(stocks) {
  const db = await initDB();
  const tx = db.transaction(STOCKS_STORE, 'readwrite');
  const store = tx.objectStore(STOCKS_STORE);
  for (const stock of stocks) {
    await store.put(stock);
  }
  await tx.done;
}

export async function searchStocks(keyword) {
  const db = await initDB();
  const lower = keyword.toLowerCase();
  const tx = db.transaction(STOCKS_STORE, 'readonly');
  const store = tx.objectStore(STOCKS_STORE);
  const allStocks = await store.getAll();
  return allStocks.filter(s => s.produitNom.toLowerCase().includes(lower));
}

export async function addSale(sale) {
  const db = await initDB();
  await db.add(STORE_NAME, { ...sale, isSynced: false, date: new Date().toISOString() });
}

export async function getUnsyncedSales() {
  const db = await initDB();
  const allSales = await db.getAll(STORE_NAME);
  return allSales.filter(sale => sale.isSynced === false);
}

export async function markSaleSynced(id) {
  const db = await initDB();
  const sale = await db.get(STORE_NAME, id);
  if (sale) {
    sale.isSynced = true;
    await db.put(STORE_NAME, sale);
  }
}

export async function getAllSales() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}
