# GraphQL Azure Subscription libraries

This repo contains the different libraries for working with the [Apollo GraphQL Subscription model](https://www.apollographql.com/docs/apollo-server/data/subscriptions) from Azure services.

## SignalR

[Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/?WT.mc_id=javascript-0000-aapowell) provides real-time messaging via websockets without needing to setup your own service.

The package, `@aaronpowell/graphql-signalr-subscriptions` provides integration with GraphQL Subscriptions, underpinned by SignalR Service.

### Installation

Install via npm or GitHub Packages:

```bash
$> npm install --save @aaronpowell/graphql-signalr-subscriptions
```

### Usage

You'll need a SignalR Service account (if you don't have an Azure account [sign up for free](https://azure.microsoft.com/free/?WT.mc_id=javascript-0000-aapowell)). Copy the connection string and provide it when you create an instance of `SignalRPubSub`:

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

## License

MIT
