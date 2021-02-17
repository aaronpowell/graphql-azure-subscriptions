import { SignalRPubSub } from "@aaronpowell/graphql-signalr-subscriptions";
import dotenv from "dotenv";

dotenv.config();

export const signalrPubSub = new SignalRPubSub(
  process.env.SIGNALR_CONNECTION_STRING || ""
);

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
