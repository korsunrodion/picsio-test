import Settings from "../models/settings";
import { RoutingIntent } from "../types";

class Strategy {
  static smallStrategyBytesLimit = 1024;
  private strategyFn?: (routingIntents: RoutingIntent[]) => RoutingIntent[];

  private allStrategy = (routingIntents: RoutingIntent[]) => {
    return routingIntents;
  }

  private importantStrategy = (routingIntents: RoutingIntent[]) => {
    return routingIntents.filter((item) => item.important === true);
  }

  private smallStrategy = (routingIntents: RoutingIntent[]) => {
    return routingIntents.filter((item) => item.bytes <= Strategy.smallStrategyBytesLimit);
  }

  private setStrategyFn = (strategy?: 'ALL' | 'IMPORTANT' | 'SMALL' | string) => {
    if (strategy === 'ALL') {
      this.strategyFn = this.allStrategy;
    } else if (strategy === 'IMPORTANT') {
      this.strategyFn = this.importantStrategy;
    } else if (strategy === 'SMALL') {
      this.strategyFn = this.smallStrategy;
    } else if (strategy) {
      this.strategyFn = (new Function(`return ${strategy}`) as () => (routingIntents: RoutingIntent[]) => RoutingIntent[])();
    }
  }

  constructor(strategy?: 'ALL' | 'IMPORTANT' | 'SMALL' | string) {
    this.setStrategyFn(strategy);
  }

  public async filterIntents(routingIntents: RoutingIntent[]) {
    if (!this.strategyFn) {
        const settings = await Settings.getSettings();
        this.setStrategyFn(settings.defaultStrategy);
    }
    if (!this.strategyFn) {
      throw new Error('[Strategy class] filterIntents - strategy function is not set');
    }
    return this.strategyFn(routingIntents);
  }
}

export default Strategy;