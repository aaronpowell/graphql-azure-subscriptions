import { CosmosDBPubSub } from "@aaronpowell/graphql-cosmosdb-subscriptions";
import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";
import { Message, MessageDataSource } from "./data";

dotenv.config();

export const cosmosPubSub = new CosmosDBPubSub(
  new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "")
    .database(process.env.COSMOS_DB || "")
    .container(process.env.COSMOS_CONTAINER || "")
);

export const resolvers = {
  Query: {
    async hello(
      parent: unknown,
      args: {},
      { dataSources }: { dataSources: { messages: MessageDataSource } }
    ) {
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
      subscribe: () => cosmosPubSub.asyncIterator("message"),
      resolve(parent: Message) {
        return parent.text;
      },
    },
  },
};
