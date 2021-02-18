import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { MessageDataSource } from "./data.js";
import { resolvers } from "./resolvers.js";
import dotenv from "dotenv";
import { CosmosClient } from "@azure/cosmos";

dotenv.config();
const messages = new MessageDataSource(
  new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "")
    .database(process.env.COSMOS_DB || "")
    .container(process.env.COSMOS_CONTAINER || "")
);
const server = new ApolloServer({
  typeDefs: importSchema("./schema.graphql"),
  resolvers,
  dataSources: () => ({
    messages,
  }),
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
