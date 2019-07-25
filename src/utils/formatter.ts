export default {
  /**
   * Format number in thousand format
   * @param {Number} number
   * @returns {string}
   */
  formatNumber(number: number) {
    return (number || 0).toLocaleString();
  },
};
