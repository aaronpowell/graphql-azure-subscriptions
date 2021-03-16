import { SignalRPubSub } from "@aaronpowell/graphql-signalr-subscriptions";
import dotenv from "dotenv";

dotenv.config();

export const signalrPubSub = new SignalRPubSub(
  process.env.SIGNALR_CONNECTION_STRING || ""
);

export const resolvers = {
  Query: {
    hello() {
      signalrPubSub.publish("MESSAGE", { getMessage: "Hello I'm a message" });
      signalrPubSub.publish("MESSAGE2", {
        getMessage: "Hello I'm a message2",
        getMessage2: "Hello I came from elsewhere",
      });
      return "Some message";
    },
  },
  Subscription: {
    getMessage: {
      subscribe: () => signalrPubSub.asyncIterator(["MESSAGE"]),
    },
    getMessage2: {
      subscribe: () => signalrPubSub.asyncIterator(["MESSAGE", "MESSAGE2"]),
    },
  },
};
