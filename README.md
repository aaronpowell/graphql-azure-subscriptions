# GraphQL Azure Subscription libraries

[![CI build](https://github.com/aaronpowell/graphql-azure-subscriptions/actions/workflows/build.yml/badge.svg)](https://github.com/aaronpowell/graphql-azure-subscriptions/actions/workflows/build.yml) | [![Release build](https://github.com/aaronpowell/graphql-azure-subscriptions/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/aaronpowell/graphql-azure-subscriptions/actions/workflows/npm-publish.yml) | ![npm - SignalR package](https://img.shields.io/npm/v/@aaronpowell/graphql-signalr-subscriptions?label=%40aaronpowell%2Fgraphql-signalr-subscriptions) | ![npm - CosmosDB package](https://img.shields.io/npm/v/@aaronpowell/graphql-cosmosdb-subscriptions?label=%40aaronpowell%2Fgraphql-cosmosdb-subscriptions)

This repo contains the different libraries for working with the [Apollo GraphQL Subscription model](https://www.apollographql.com/docs/apollo-server/data/subscriptions) from Azure services.

## SignalR

[Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/?WT.mc_id=javascript-17899-aapowell) provides real-time messaging via websockets without needing to setup your own service.

The package, `@aaronpowell/graphql-signalr-subscriptions` provides integration with GraphQL Subscriptions, underpinned by SignalR Service. Learn more at [`packages/graphql-signalr-subscriptions`](packages/graphql-signalr-subscriptions).

## CosmosDB Change Feed

[Azure CosmosDB](https://azure.microsoft.com/services/cosmos-db/?WT.mc_id=javascript-17901-aapowell) provides a [Change Feed](https://docs.microsoft.com/azure/cosmos-db/change-feed?WT.mc_id=javascript-17901-aapowell) of data that is changed within a collection.

The package, `@aaronpowell/graphql-cosmosdb-subscriptions` provides integration with GraphQL Subscriptions, exposing the CosmosDB Change Feed to consumers. Learn more at [`packages/graphql-cosmosdb-subscriptions`](packages/graphql-cosmosdb-subscriptions).

## License

MIT
