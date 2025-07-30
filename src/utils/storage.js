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
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('Unable to load profile from local storage', err);
    return null;
  }
}