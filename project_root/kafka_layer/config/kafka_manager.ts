import { Kafka } from "kafkajs";

const givenBroker = process.env.KAFKA_PUBLIC;

const kafka = new Kafka({
  clientId: "ontology-CS-554",
  brokers: givenBroker ? [givenBroker] : [],
});

export const producer = kafka.producer();



export function validateKafkaConfig(): void {
  if (!givenBroker) {
    throw new Error("KAFKA_PUBLIC environment variable is not set");
  }
}

export default kafka;
