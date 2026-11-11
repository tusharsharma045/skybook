/**
 * @typedef {Object} AirportResult
 * @property {string} iataCode
 * @property {string} name
 * @property {string} city
 * @property {string} country
 * @property {string} timeZone
 */

/**
 * @typedef {Object} FlightSearchParams
 * @property {string} origin
 * @property {string} destination
 * @property {string} departureDate
 * @property {string} [returnDate]
 * @property {number} [adults]
 * @property {number} [children]
 * @property {number} [infants]
 * @property {string} [cabinClass]
 */

export class FlightProvider {
  /**
   * Search for airports / cities matching query
   * @param {string} query
   * @returns {Promise<AirportResult[]>}
   */
  async searchAirports(query) {
    throw new Error('Method searchAirports() must be implemented');
  }

  /**
   * Search flight offers
   * @param {FlightSearchParams} params
   * @returns {Promise<Array>}
   */
  async searchOffers(params) {
    throw new Error('Method searchOffers() must be implemented');
  }

  /**
   * Get full details of a specific flight offer
   * @param {string} offerId
   * @returns {Promise<Object>}
   */
  async getOffer(offerId) {
    throw new Error('Method getOffer() must be implemented');
  }
}
