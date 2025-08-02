/**
 * Utility functions for storing and retrieving data from localStorage.
 * These helpers centralize the keys used throughout the application.
 */

const PROFILE_KEY = 'chefAlergProfile';

/**
 * Save the given profile object to localStorage.
 * @param {Object} profile
 */
export function saveLocalProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Unable to save profile to local storage', err);
  }
}

/**
 * Load the profile from localStorage.
 * @returns {Object|null}
 */
export function loadLocalProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.warn('Unable to load profile from local storage', err);
    try {
      // Remove any corrupted data so future calls don't keep failing
      localStorage.removeItem(PROFILE_KEY);
    } catch (_) {
      /* ignore */
    }
    return null;
  }
}
