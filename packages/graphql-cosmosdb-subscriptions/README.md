# CosmosDB GraphQL Subscriptions ![npm - CosmosDB package](https://img.shields.io/npm/v/@aaronpowell/graphql-cosmosdb-subscriptions?label=%40aaronpowell%2Fgraphql-cosmosdb-subscriptions)

This package contains support for [Apollo GraphQL Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions), using the [Azure CosmosDB Change Feed](https://docs.microsoft.com/azure/cosmos-db/change-feed?WT.mc_id=javascript-17901-aapowell).

## Installation

Install via npm or GitHub Packages:

```bash
$> npm install --save @aaronpowell/graphql-cosmosdb-subscriptions
```

## Usage

You'll need a SignalR Service account (if you don't have an Azure account [sign up for free](https://azure.microsoft.com/free/?WT.mc_id=javascript-17901-aapowell)). Copy the connection string and provide it when you create an instance of `SignalRPubSub`:

```typescript
import { CosmosDBPubSub } from "@aaronpowell/graphql-cosmosdb-subscriptions";

const cosmosPubSub = new CosmosDBPubSub(
  new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "")
    .database(process.env.COSMOS_DB || "")
    .container(process.env.COSMOS_CONTAINER || "")
);
```

Unlike most pubsub libraries, you don't need to publish directly, messages are received when the Change Feed receives messages. When creating the subscription, you subscribe to a CosmosDB partition key value (in the below example `type` is the partition key and we're subscription when `type = 'message'`).

```typescript
export const resolvers = {
  Query: {
    async hello(parent, args, { dataSources }) {
      const text = `Message! ${Date.now()}`;
      await dataSources.messages.createOne({
        id: Date.now() + "",
        text,
        type: "message",
      });
      return text;
    },
  },
  Subscription: {
    getMessage: {
      subscribe: () => cosmosPubSub.asyncIterator(["message"]),
    },
  },
};
```
