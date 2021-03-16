import { PubSubEngine } from "graphql-subscriptions";
import { SignalRClient } from "./SignalRClient.js";

type SubscriptionInfo = {
  onMessage: (...args: unknown[]) => void;
  triggerName: string;
};

export class SignalRPubSub extends PubSubEngine {
  private client: SignalRClient;
  private handlerMap = new Map<number, SubscriptionInfo>();
  constructor(signalRConnectionString: string) {
    super();
    this.client = SignalRClient.fromConnectionString(signalRConnectionString);
  }
  public start() {
    return this.client.start();
  }
  publish<T>(triggerName: string, payload: T): Promise<void> {
    return this.client.send(triggerName, payload);
  }
  subscribe(
    triggerName: string,
    onMessage: (...args: unknown[]) => void
  ): Promise<number> {
    this.client.on(triggerName, onMessage);

    const id = Date.now() * Math.random();
    this.handlerMap.set(id, { onMessage, triggerName });

    return Promise.resolve(id);
  }
  unsubscribe(subId: number) {
    const info = this.handlerMap.get(subId);
    if (info) {
      this.client.off(info.triggerName, info.onMessage);
      this.handlerMap.delete(subId);
    }
  }
}
