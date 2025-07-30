import { saveLocalProfile, loadLocalProfile } from '../utils/storage';

// Placeholder for Firebase initialization.  In a real application you
// would import Firebase and initialize it with your project's
// configuration.  For this MVP we mock the remote calls by
// interacting solely with localStorage.
//
// Example:
// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
// const firebaseConfig = { /* ... */ };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

/**
 * Persist the player's profile to the backend.  If Firebase is not
 * configured, the profile will still be saved locally.
 * @param {Object} profile
 */
export async function saveProfile(profile) {
  // Save locally regardless of remote success.
  saveLocalProfile(profile);
  // In a production version, you would write to Firestore here.
  // For example:
  // const docRef = doc(db, 'profiles', profile.uid);
  // await setDoc(docRef, profile);
  return Promise.resolve();
}

/**
 * Load the player's profile from the backend.  Falls back to
 * localStorage when the remote is unavailable or no entry exists.
 * @returns {Promise<Object|null>}
 */
export async function loadProfile() {
  // Try to fetch from local storage.
  const local = loadLocalProfile();
  if (local) return local;
  // In a real application, attempt to fetch from Firestore here.
  return null;
}