require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
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
    const plantsCollection = database.collection("plants");
    const usersCollection = database.collection("users");

    // users related API
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const cursor = req.body;
      const exitingUser = await usersCollection.findOne({
        email: cursor.email,
      });
      if (exitingUser) {
        res.send(exitingUser);
      } else {
        const result = await usersCollection.insertOne(cursor);
        res.send(result);
      }
    });

    // plants related API
    app.get("/plant/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantsCollection.findOne(query);
      res.send(result);
    });

    app.get("/myplants/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await plantsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/plants", async (req, res) => {
      const cursor = plantsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/plants", async (req, res) => {
      const cursor = req.body;
      const result = await plantsCollection.insertOne(cursor);
      res.send(result);
    });

    app.put("/updateplant/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatePlant = req.body;
      const updateDoc = { $set: updatePlant };
      const options = { upsert: true };
      const result = await plantsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("plant-care-tracker-server is running");
});

app.listen(port, () => {
  console.log("plant-care-tracker-server running on", port);
});
