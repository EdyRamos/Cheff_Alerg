import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { saveLocalProfile, loadLocalProfile } from '../utils/storage';
import { readTag, writeTag } from './nfc';

let app;
let db;

/**
 * Lazily initialize Firebase and return the Firestore instance.
 */
function getDb() {
  if (!db) {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

/**
 * Persist the player's profile to the backend.  If Firebase is not
 * configured, the profile will still be saved locally.
 * @param {Object} profile
 */
export async function saveProfile(profile, { nfc = false } = {}) {
  // Always persist locally
  saveLocalProfile(profile);

  try {
    const db = getDb();
    const ref = doc(db, 'profiles', profile.uid);
    await setDoc(ref, profile);
    if (nfc) {
      await writeTag(JSON.stringify(profile));
    }
  } catch (err) {
    console.warn('Failed to save profile to Firestore', err);
  }
}

/**
 * Load the player's profile from the backend.  Falls back to
 * localStorage when the remote is unavailable or no entry exists.
 * @returns {Promise<Object|null>}
 */
export async function loadProfile({ nfc = false } = {}) {
  let profile = loadLocalProfile();

  if (nfc && !profile) {
    try {
      const tagData = await readTag();
      if (tagData) {
        profile = JSON.parse(tagData);
        saveLocalProfile(profile);
      }
    } catch (err) {
      console.warn('Failed to read NFC tag', err);
    }
  }

  if (profile) {
    try {
      const db = getDb();
      const ref = doc(db, 'profiles', profile.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const remote = snap.data();
        saveLocalProfile(remote);
        return remote;
      }
    } catch (err) {
      console.warn('Failed to load profile from Firestore', err);
    }
    return profile;
  }

  return null;
}
