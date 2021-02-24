import { PubSubEngine } from "graphql-subscriptions";
import {
  ChangeFeedIterator,
  ChangeFeedResponse,
  Container,
} from "@azure/cosmos";

export class CosmosDBPubSub extends PubSubEngine {
  private changeFeedSubscriptionTracking = new Map<number, boolean>();
  constructor(private container: Container) {
    super();
  }
  publish(): Promise<void> {
    throw new Error(
      "Can't directly publish, instead modify data in the cosmos container"
    );
  }
  subscribe(
    triggerName: string,
    onMessage: (...args: unknown[]) => void
  ): Promise<number> {
    const feed = this.container.items.changeFeed(triggerName, {
      startTime: new Date(),
    });

    const id = Date.now() * Math.random();
    feed.fetchNext().then(this.onFetchNext(id, feed, onMessage));
    this.changeFeedSubscriptionTracking.set(id, true);
    return Promise.resolve(id);
  }
  unsubscribe(subId: number) {
    this.changeFeedSubscriptionTracking.set(subId, false);
  }

  private onFetchNext(
    id: number,
    feed: ChangeFeedIterator<unknown>,
    onMessage: (...args: unknown[]) => void
  ) {
    return ({ result }: ChangeFeedResponse<unknown[]>) => {
      for (const item of result) {
        onMessage(item);
      }
      if (this.changeFeedSubscriptionTracking.get(id)) {
        feed.fetchNext().then(this.onFetchNext(id, feed, onMessage));
      } else {
        this.changeFeedSubscriptionTracking.delete(id);
      }
    };
  }
}
