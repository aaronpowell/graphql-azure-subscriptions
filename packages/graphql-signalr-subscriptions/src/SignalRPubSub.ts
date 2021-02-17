import { PubSubEngine } from "graphql-subscriptions";
import { SignalRClient } from "./SignalRClient.js";

export class SignalRPubSub extends PubSubEngine {
  private client: SignalRClient;
  private handlerMap = new Map<number, (...args: unknown[]) => void>();
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
    this.client.on(triggerName, (args) => {
      onMessage(args);
    });

    const id = Date.now() * Math.random();
    this.handlerMap.set(id, onMessage);

    return Promise.resolve(id);
  }
  unsubscribe(subId: number) {
    if (this.handlerMap.has(subId)) {
      this.handlerMap.delete(subId);
    }
  }
}
