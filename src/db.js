// On-device storage via IndexedDB. Everything stays on the phone — no server,
// no network. Document images are kept as data-URLs inside the record so a
// single backup file can carry everything.
//
// Stores:
//   members : { id, name, relation }
//   docs    : { id, memberId, typeId, title, number, issueDate, expiryDate,
//               notes, image (dataURL), createdAt }

const DB_NAME = 'kaagaz-mitra'
const DB_VERSION = 1
const STORES = ['members', 'docs']

let dbPromise = null

function open() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx(store, mode, fn) {
  return open().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(store, mode)
        const os = t.objectStore(store)
        const result = fn(os)
        t.oncomplete = () => resolve(result)
        t.onerror = () => reject(t.error)
        t.onabort = () => reject(t.error)
      }),
  )
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export function getAll(store) {
  return open().then(
    (db) =>
      new Promise((resolve, reject) => {
        const req = db.transaction(store, 'readonly').objectStore(store).getAll()
        req.onsuccess = () => resolve(req.result || [])
        req.onerror = () => reject(req.error)
      }),
  )
}

export const put = (store, value) => tx(store, 'readwrite', (os) => os.put(value))
export const del = (store, id) => tx(store, 'readwrite', (os) => os.delete(id))

export async function exportAll() {
  const [members, docs] = await Promise.all([getAll('members'), getAll('docs')])
  return { app: 'kaagaz-mitra', version: 1, exportedAt: new Date().toISOString(), members, docs }
}

export async function importAll(data) {
  if (!data || data.app !== 'kaagaz-mitra') throw new Error('Not a Kaagaz Mitra backup')
  for (const m of data.members || []) await put('members', m)
  for (const d of data.docs || []) await put('docs', d)
}
