import express from 'express';
import Strategy from '../utils/strategy';
import { body } from 'express-validator';
import transportService from '../services/transportService';
import { RoutingIntent } from '../types';
import logger from '../logger';
import { authenticateToken } from '../middleware';

const eventsRouter = express.Router();

/**
 * Route for processing of intents
 * @name events
 * @body payload - payload to send
 * @body routingIntents - destinations of the request
 * @body strategy - strategy to filter the intents with
 */
eventsRouter.post(
  '/',
  authenticateToken,
  body('payload').isObject(),
  body('routingIntents').isObject(),
  body('strategy').isString(),
  async (req, res) => {
    try {
      const { payload, strategy: strategyBody } = req.body;
      const routingIntents = req.body.routingIntents as RoutingIntent[];

      const strategy = new Strategy(strategyBody);
      const filteredIntents = await strategy.filterIntents(routingIntents);

      const filteredNames = filteredIntents.map((item) => item.destinationName);
      const skippedDestinations = routingIntents.filter((item) => !filteredNames.includes(item.destinationName));

      for (const sd of skippedDestinations) {
        logger.info(`[${sd.destinationName}] to be skipped`);
      }

      const result = await transportService.processIntents(filteredIntents, payload);
      const responseBase = routingIntents.map((item) => item.destinationName).reduce((acc, cur) => {
        acc[cur] = false;
        return acc;
      }, {} as Record<string, boolean>)

      res.status(200).send(Object.assign(responseBase, result));
    } catch (e) {
      logger.error(`[Events router] / - Error processing the request ${e}`);
      res.sendStatus(500);
    }
  }
);

export default eventsRouter;