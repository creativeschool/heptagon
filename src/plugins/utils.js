/**
 * @param {any[]} arr1
 * @param {any[]} arr2
 */
export const compareArraySimple = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

/**
 * @param {any[]} arr1
 * @param {any[]} arr2
 * @param {string[]} keys
 */
export const compareArrayComplex = (arr1, arr2, keys) => {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (keys.some(k => arr1[i][k] !== arr2[i][k])) return false
  }
  return true
}
