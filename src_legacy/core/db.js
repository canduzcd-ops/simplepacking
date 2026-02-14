const DB_NAME = "raca-packing-db";
const DB_VERSION = 1;
const STORE_SCENARIOS = "scenarios";

let dbPromise = null;

function openDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_SCENARIOS)) {
                db.createObjectStore(STORE_SCENARIOS, { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject(event.target.error);
        };
    });
    return dbPromise;
}

export async function getAllScenarios() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_SCENARIOS, "readonly");
        const store = tx.objectStore(STORE_SCENARIOS);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

export async function saveScenario(scenario) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_SCENARIOS, "readwrite");
        const store = tx.objectStore(STORE_SCENARIOS);
        const request = store.put(scenario);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteScenario(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_SCENARIOS, "readwrite");
        const store = tx.objectStore(STORE_SCENARIOS);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Migrate from localStorage if needed.
 * Returns true if migration happened.
 */
export async function migrateFromLocalStorage(legacyKey) {
    try {
        const raw = localStorage.getItem(legacyKey);
        if (!raw) return false;

        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.scenarios) && parsed.scenarios.length > 0) {
            const db = await openDB();
            const tx = db.transaction(STORE_SCENARIOS, "readwrite");
            const store = tx.objectStore(STORE_SCENARIOS);

            for (const s of parsed.scenarios) {
                store.put(s);
            }

            // Clear old data to prevent re-migration
            localStorage.removeItem(legacyKey);
            return true;
        }
    } catch (e) {
        console.warn("Migration failed or no data:", e);
    }
    return false;
}
