# SignalR GraphQL Subscriptions ![npm - SignalR package](https://img.shields.io/npm/v/@aaronpowell/graphql-signalr-subscriptions?label=%40aaronpowell%2Fgraphql-signalr-subscriptions)

This package contains support for [Apollo GraphQL Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions), using the [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service?WT.mc_id=javascript-17899-aapowell).

## Installation

Install via npm or GitHub Packages:

```bash
$> npm install --save @aaronpowell/graphql-signalr-subscriptions
```

## Usage

You'll need a SignalR Service account (if you don't have an Azure account [sign up for free](https://azure.microsoft.com/free/?WT.mc_id=javascript-17899-aapowell)). Copy the connection string and provide it when you create an instance of `SignalRPubSub`:

```typescript
import { SignalRPubSub } from "@aaronpowell/graphql-signalr-subscriptions";

const signalrPubSub = new SignalRPubSub("<connection string>");
```

When your server is ready, you can start the pubsub client:

```typescript
signalrPubSub
  .start()
  .then(() => console.log("SignalR PubSub is up and running"))
  .catch((error) => console.error(error));
```

From within a resolver, you use it the same as any other pubsub implementation:

```typescript
export const resolvers = {
  Query: {
    hello() {
      signalrPubSub.publish("TESTING", { getMessage: "Hello I'm a message" });
      return "Some message";
    },
  },
  Subscription: {
    getMessage: {
      subscribe: () => signalrPubSub.asyncIterator(["TESTING"]),
    },
  },
};
```
