import { hasAllergen, addAllergen, removeAllergen, bitmaskToArray, arrayToBitmask } from './bitmask';

describe('bitmask utilities', () => {
  test('handles setting and removing allergens', () => {
    let mask = 0;
    mask = addAllergen(mask, 2);
    expect(hasAllergen(mask, 2)).toBe(true);
    mask = removeAllergen(mask, 2);
    expect(hasAllergen(mask, 2)).toBe(false);
  });

  test('converts bitmask with high bits to array', () => {
    // set bits 3 and 8 to ensure we exercise bits above the previous default
    let mask = 0;
    mask = addAllergen(mask, 3);
    mask = addAllergen(mask, 8);

    expect(bitmaskToArray(mask)).toEqual([3, 8]);
    expect(arrayToBitmask([3, 8])).toBe(mask);
  });
});

