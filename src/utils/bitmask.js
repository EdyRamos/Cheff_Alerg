/**
 * Utility functions for working with an allergen bitmask.
 * Each bit corresponds to a particular allergen as defined in
 * components/Register.js.  A bit value of 1 indicates the player
 * should avoid that allergen.
 */

/**
 * Check whether the given bit is set in the bitmask.
 * @param {number} mask
 * @param {number} bit
 * @returns {boolean}
 */
export function hasAllergen(mask, bit) {
  return (mask & (1 << bit)) !== 0;
}

/**
 * Return a new bitmask with the given bit set (turned on).
 * @param {number} mask
 * @param {number} bit
 * @returns {number}
 */
export function addAllergen(mask, bit) {
  return mask | (1 << bit);
}

/**
 * Return a new bitmask with the given bit cleared (turned off).
 * @param {number} mask
 * @param {number} bit
 * @returns {number}
 */
export function removeAllergen(mask, bit) {
  return mask & ~(1 << bit);
}

/**
 * Convert a bitmask into an array of bit indices that are set.
 *
 * If `bitCount` is not provided, the function will inspect the mask and
 * iterate only over the bits necessary to represent it.  The previous
 * implementation defaulted to a hard coded bit count of 7 which meant any
 * allergens represented by higher bits (e.g. bit 8 for "Milho") were ignored.
 *
 * @param {number} mask
 * @param {number} [bitCount] optional number of bits to inspect
 * @returns {number[]}
 */
export function bitmaskToArray(mask, bitCount) {
  const count =
    typeof bitCount === 'number'
      ? bitCount
      : mask === 0
      ? 0
      : Math.floor(Math.log2(mask)) + 1;
  const bits = [];
  for (let i = 0; i < count; i++) {
    if (hasAllergen(mask, i)) bits.push(i);
  }
  return bits;
}

/**
 * Construct a bitmask from an array of bit indices.
 * @param {number[]} bits
 * @returns {number}
 */
export function arrayToBitmask(bits) {
  return bits.reduce((mask, bit) => addAllergen(mask, bit), 0);
}