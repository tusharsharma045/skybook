import { env } from '../../config/env.js';
import { DuffelFlightProvider } from './DuffelFlightProvider.js';
import { SimulatedFlightProvider } from './SimulatedFlightProvider.js';
import { logger } from '../../config/logger.js';

class FlightProviderFactory {
  static getProvider() {
    if (env.DUFFEL_API_TOKEN && env.DUFFEL_API_TOKEN.trim().length > 0) {
      logger.info('Using Duffel Flight Provider');
      return new DuffelFlightProvider(env.DUFFEL_API_TOKEN);
    }

    logger.info('Using SkyBook Simulated Flight Provider (High-fidelity aviation data)');
    return new SimulatedFlightProvider();
  }
}

export const flightProvider = FlightProviderFactory.getProvider();
