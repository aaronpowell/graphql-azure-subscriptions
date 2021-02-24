import { CosmosDataSource } from "apollo-datasource-cosmosdb";

export type Message = {
  id: string;
  text: string;
  type: "message";
};

export class MessageDataSource extends CosmosDataSource<Message, unknown> {}
