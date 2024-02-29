import axios from "axios";
import { IDestination, RoutingIntent } from "../types";
import logger from "../logger";
import Destination from "../models/destination";

class TransportService {
  private static async makeDestinationRequest(destination: IDestination, payload: Record<string, any>) {
    const { transport, url } = destination;

    if (!url) {
      throw new Error(`[Transport service] makeDestinationRequest - url not specified for http transport (${transport})`)
    }

    if (!transport.startsWith('http')) {
      throw new Error(`[Transport service] makeDestinationRequest - not a valid transport (${transport})`)
    }

    const method = transport.split('.')[1] as 'get' | 'post' | 'put' | 'delete' | 'patch';
    const requestFn = axios[method];

    const config = method === 'get' ? {
      params: payload
    } : {
      data: payload
    };

    await requestFn(url, config);
    logger.info(`Payload sent to ${destination.destinationName} via ${destination.transport} transport`);
  }

  private static async makeDestinationConsole(destination: IDestination) {
    const { transport, destinationName } = destination;
    if (!transport.startsWith('console')) {
      throw new Error(`[Transport service] makeDestinationConsole - not a valid transport (${transport})`)
    }

    const method = transport.split('.')[1] as 'log' | 'error' | 'debug' | 'warn';
    const consoleFn = console[method];

    consoleFn(`Payload sent to ${destinationName} via ${transport} transport`)
  }

  public async processIntents(intents: RoutingIntent[], payload: Record<string, any>) {
    const destinations = await Destination.find({
      destinationName: {
        $in: intents.map((item) => item.destinationName),
      }
    }).lean();

    const result = intents.map((item) => item.destinationName).reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {} as Record<string, boolean>);
    for (const d of intents) {
      const destination = destinations.find((item) => item.destinationName === d.destinationName);

      if (!destination) {
        logger.error(`[Events router] / - Unknown destination (${d.destinationName})`);
        continue;
      }

      try {
        if (destination.transport.startsWith('http')) {
          await TransportService.makeDestinationRequest(destination, payload)
        } else if (destination.transport.startsWith('console')) {
          await TransportService.makeDestinationConsole(destination);
        }
        result[destination.destinationName] = true;
      } catch (e) {
        logger.error(`[Transport service] processDestinations - Error while processing destination ${destination.destinationName}, error: ${e}`)
        continue;
      }
    }
    return result;
  }
}

export default new TransportService();