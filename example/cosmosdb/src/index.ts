import { CosmosClient } from "@azure/cosmos";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MessageDataSource } from "./data.js";
import { resolvers } from "./resolvers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const messages = new MessageDataSource(
  new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "")
    .database(process.env.COSMOS_DB || "")
    .container(process.env.COSMOS_CONTAINER || "")
);

const schema = loadSchemaSync(join(__dirname, "..", "schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({
  schema: schemaWithResolvers,
  dataSources: () => ({
    messages,
  }),
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
