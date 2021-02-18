import { CosmosDBPubSub } from "@aaronpowell/graphql-cosmosdb-subscriptions";
import dotenv from "dotenv";
import { Message, MessageDataSource } from "./data";
import { Resolvers } from "./types";

dotenv.config();

export const cosmosPubSub = new CosmosDBPubSub(
  process.env.COSMOS_CONNECTION_STRING || "",
  process.env.COSMOS_DB || "",
  process.env.COSMOS_CONTAINER || ""
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
