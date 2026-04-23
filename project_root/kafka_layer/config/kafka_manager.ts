import { Kafka } from "kafkajs";

const givenBroker = process.env.Kafka_Public;

if (!givenBroker) {
  throw new Error("Kafka_Public environment variable is not set");
}

const kafka = new Kafka({
  clientId: "ontology-CS-554",
  brokers: [givenBroker]
});

export const producer = kafka.producer();

export default kafka;


