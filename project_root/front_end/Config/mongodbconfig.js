const { MongoClient, ServerApiVersion } = require('mongodb');
const db_username=import.meta.env.dbusername;
const db_password=import.meta.env.dbPassword;
const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.ullgzkq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    await client.close();
    }
}
run().catch(console.dir);