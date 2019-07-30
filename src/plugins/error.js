/**
 * @param {Error} e
 */
export const handleError = (e) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(e)
  }
}
