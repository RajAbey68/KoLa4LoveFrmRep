// Firebase configuration for Ko Lake Villa - Build-compatible version with persistent file storage
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

let db: any, storage: any, app: any;

// Persistent file-based store
const DB_FILE = join(process.cwd(), 'server', 'persistent-db.json');

// Load existing data or create empty structure
const loadPersistedData = (): Record<string, Record<string, any>> => {
  if (existsSync(DB_FILE)) {
    try {
      return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  }
  return {};
};

// Save data to file
const savePersistedData = (data: Record<string, Record<string, any>>) => {
  try {
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving persisted data:', error);
  }
};

// Initialize with persisted data
const persistentStore = loadPersistedData();

// Initialize collection if it doesn't exist
const ensureCollection = (collectionName: string) => {
  if (!persistentStore[collectionName]) {
    persistentStore[collectionName] = {};
  }
  return persistentStore[collectionName];
};

// Create working Firebase stub with actual data persistence
const createFirebaseStub = () => {
  return {
    collection: (name: string) => ({
      add: async (data: any) => {
        const collection = ensureCollection(name);
        const id = `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const docData = { id, ...data };
        collection[id] = docData;
        savePersistedData(persistentStore);
        console.log(`💾 Added to ${name}:`, id, 'Total docs:', Object.keys(collection).length);
        return { id, ...docData };
      },
      doc: (id: string) => ({
        get: async () => {
          const collection = ensureCollection(name);
          const exists = !!collection[id];
          return { 
            exists, 
            id, 
            data: () => exists ? collection[id] : null
          };
        },
        set: async (data: any) => {
          const collection = ensureCollection(name);
          collection[id] = { id, ...data };
          savePersistedData(persistentStore);
          return { id, ...data };
        },
        update: async (data: any) => {
          const collection = ensureCollection(name);
          if (collection[id]) {
            collection[id] = { ...collection[id], ...data };
            savePersistedData(persistentStore);
          }
          return { id, ...data };
        },
        delete: async () => {
          const collection = ensureCollection(name);
          delete collection[id];
          savePersistedData(persistentStore);
          return {};
        }
      }),
      where: (field: string, op: string, value: any) => ({
        limit: (num: number) => ({
          get: async () => {
            const collection = ensureCollection(name);
            const docs = Object.values(collection)
              .filter((doc: any) => {
                if (op === '==') return doc[field] === value;
                if (op === '!=') return doc[field] !== value;
                return true;
              })
              .slice(0, num)
              .map((doc: any) => ({
                id: doc.id,
                data: () => doc
              }));
            console.log(`🔍 Query ${name} where ${field} ${op} ${value}, limit ${num}: found ${docs.length} docs`);
            return { empty: docs.length === 0, docs };
          }
        }),
        get: async () => {
          const collection = ensureCollection(name);
          const docs = Object.values(collection)
            .filter((doc: any) => {
              if (op === '==') return doc[field] === value;
              if (op === '!=') return doc[field] !== value;
              return true;
            })
            .map((doc: any) => ({
              id: doc.id,
              data: () => doc
            }));
          console.log(`🔍 Query ${name} where ${field} ${op} ${value}: found ${docs.length} docs`);
          return { docs };
        }
      }),
      limit: (num: number) => ({
        get: async () => {
          const collection = ensureCollection(name);
          const docs = Object.values(collection)
            .slice(0, num)
            .map((doc: any) => ({
              id: doc.id,
              data: () => doc
            }));
          console.log(`🔍 Query ${name} limit ${num}: found ${docs.length} docs`);
          return { docs };
        }
      }),
      get: async () => {
        const collection = ensureCollection(name);
        const docs = Object.values(collection).map((doc: any) => ({
          id: doc.id,
          data: () => doc
        }));
        console.log(`🔍 Get all ${name}: found ${docs.length} docs`);
        return { docs };
      }
    })
  };
};

const createStorageStub = () => {
  return {
    bucket: () => ({
      file: (path: string) => ({
        exists: async () => [true],
        save: async (buffer: Buffer) => ({ path }),
        delete: async () => ({}),
        getDownloadURL: async () => `/images/placeholder.jpg`
      })
    })
  };
};

// Initialize with working stubs
db = createFirebaseStub();
storage = createStorageStub();

// Ensure sample data exists in persistent store
if (!persistentStore['galleryImages'] || Object.keys(persistentStore['galleryImages']).length === 0) {
  const sampleData = {
    id: 'sample1',
    title: 'Ko Lake Villa Sample',
    description: 'Sample villa image',
    category: 'villa',
    objectPath: 'sample/villa.jpg',
    isActive: true,
    createdAt: Date.now()
  };
  persistentStore['galleryImages'] = { 'sample1': sampleData };
  savePersistedData(persistentStore);
}

export { db, storage };

// Firebase collections
export const collections = {
  galleryImages: 'galleryImages',
  seoMeta: 'seo_meta', 
  apiUsage: 'api_usage',
  koLakeLife: 'ko_lake_life',
  testimonials: 'testimonials',
  villaSettings: 'villa_settings',
  users: 'users',
  roles: 'roles',
  authorizedContacts: 'authorized_contacts',
  cmsContent: 'cms_content'
};

// Helper functions (working versions)
export const createDocument = async (collection: string, data: any, id?: string) => {
  const docRef = db.collection(collection);
  const docId = id || `doc_${Date.now()}`;
  const newData = {
    ...data,
    id: docId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await docRef.doc(docId).set(newData);
  return newData;
};

export const updateDocument = async (collection: string, id: string, data: any) => {
  const updateData = {
    ...data,
    updatedAt: new Date()
  };
  await db.collection(collection).doc(id).update(updateData);
  return updateData;
};

export const getDocument = async (collection: string, id: string) => {
  const doc = await db.collection(collection).doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const queryCollection = async (collection: string, filters?: any[]) => {
  let query = db.collection(collection);
  
  if (filters) {
    filters.forEach(filter => {
      query = query.where(filter.field, filter.operator, filter.value);
    });
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

export const deleteDocument = async (collection: string, id: string) => {
  await db.collection(collection).doc(id).delete();
  return { success: true };
};

export const safeDbAccess = () => {
  if (!db) {
    throw new Error('Database not available');
  }
  return db;
};

// Debug helper to see what's in persistent storage
export const debugPersistentStore = () => {
  console.log('🗃️ Persistent Store Contents:', 
    Object.keys(persistentStore).map(collection => 
      `${collection}: ${Object.keys(persistentStore[collection]).length} docs`
    )
  );
  return persistentStore;
};