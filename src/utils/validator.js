const VALID_IP_ADDRESS_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
const VALID_HOST_NAME_REGEX = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
const VALID_INT_NUMBER_REGEX = /^[0-9]+$/;

export default {
  /**
   * Validate host
   * @param {string} host
   */
  validateHost(host) {
    return VALID_IP_ADDRESS_REGEX.test(host) || VALID_HOST_NAME_REGEX.test(host);
  },

  /**
   * Validate port
   * @param {String || Number} port
   */
  validatePort(port) {
    return VALID_INT_NUMBER_REGEX.test(port);
  },
};
