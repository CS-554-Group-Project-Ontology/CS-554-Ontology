import { Kafka } from "kafkajs";

const givenBroker = process.env.KAFKA_PUBLIC;

if (!givenBroker) {
  throw new Error("KAKFA_PUBLIC environment variable is not set or being imported correctly");
}

const kafka = new Kafka({
  clientId: "ontology-CS-554",
  brokers: [givenBroker]
});

export const producer = kafka.producer();

export default kafka;


