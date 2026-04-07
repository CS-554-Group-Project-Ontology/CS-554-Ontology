import { Kafka } from "kafkajs";

const givenBroker = process.env.Kafka_Public;


const kafka = new Kafka({
  clientId: "ontology-CS-554",
  brokers: [givenBroker!]
});

export default kafka;


