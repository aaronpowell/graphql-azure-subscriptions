import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
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

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  signalrPubSub
    .start()
    .then(() => console.log("🚀 SignalR up and running"))
    .catch((err: any) => console.error(err));
});
