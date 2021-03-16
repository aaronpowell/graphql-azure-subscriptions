import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { resolvers, signalrPubSub } from "./resolvers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = loadSchemaSync(join(__dirname, "..", "schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({
  schema: schemaWithResolvers,
});

const app = express();
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 4000;

httpServer.listen({ port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  );

  signalrPubSub
    .start()
    .then(() => console.log("🚀 SignalR up and running"))
    .catch((err: any) => console.error(err));
});
