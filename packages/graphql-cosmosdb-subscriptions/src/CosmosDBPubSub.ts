import { PubSubEngine } from "graphql-subscriptions";
import {
  ChangeFeedIterator,
  ChangeFeedResponse,
  Container,
  CosmosClient,
} from "@azure/cosmos";

export class CosmosDBPubSub extends PubSubEngine {
  private client: CosmosClient;
  private container: Container;
  private changeFeedSubscriptionTracking = new Map<number, boolean>();
  constructor(
    cosmosDBConnectionString: string,
    database: string,
    container: string
  ) {
    super();

    this.client = new CosmosClient(cosmosDBConnectionString);
    this.container = this.client.database(database).container(container);
  }
  publish(triggerName: string, payload: any): Promise<void> {
    throw new Error(
      "Can't directly publish, instead modify data in the cosmos container"
    );
  }
  subscribe(
    triggerName: string,
    onMessage: Function,
    options: Object
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
    feed: ChangeFeedIterator<any>,
    onMessage: Function
  ) {
    return ({ result }: ChangeFeedResponse<any[]>) => {
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
