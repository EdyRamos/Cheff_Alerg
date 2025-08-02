import { saveLocalProfile, loadLocalProfile } from './storage';

describe('storage utilities', () => {
  const KEY = 'chefAlergProfile';

  afterEach(() => {
    localStorage.clear();
  });

  test('saves and loads profile', () => {
    const profile = { name: 'Ana', bitmask: 3 };
    saveLocalProfile(profile);
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify(profile));
    expect(loadLocalProfile()).toEqual(profile);
  });

  test('returns null and clears invalid data', () => {
    localStorage.setItem(KEY, 'not-json');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const loaded = loadLocalProfile();
    expect(loaded).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
    warnSpy.mockRestore();
  });
});
