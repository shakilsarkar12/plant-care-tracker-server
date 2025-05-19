const express = require('express');
const cors = require('cors');
require("dotenv").config({ override: true });
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// const uri =process.env.DB_URI;

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
      const database = client.db("plantCareDB");
      const plants = database.collection("plants");

      app.post("/plants", async (req, res) => {
          const cursor = req.body;
          const result = await plants.insertOne(cursor);
          res.send(result)
      })
  } finally {
      
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("plant-care-tracker-server is running")
})

app.listen(port, () => {
    console.log("plant-care-tracker-server running on", port);
})