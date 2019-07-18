export default {
  /**
   * Format number in thousand format
   * @param {Number} number
   * @returns {String}
   */
  formatNumber(number) {
    return (number || 0).toLocaleString();
  },
};
