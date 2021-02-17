import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { resolvers, signalrPubSub } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs: importSchema("./schema.graphql"),
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  signalrPubSub
    .start()
    .then(() => console.log("signalr up and running"))
    .catch((err) => console.error(err));
});
