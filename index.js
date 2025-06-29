require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "https://plant-care-tracker-c369a.web.app",
      "http://localhost:5173",
    ],
  })
);
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
    const feedbackCollection = database.collection("feedback");
    const contactCollection = database.collection("contact");

    // users related API
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
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

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updatedUser = req.body;

      try {
        const result = await usersCollection.updateOne(
          { email },
          { $set: updatedUser }
        );

        res.status(200).json({
          success: true,
          modifiedCount: result.modifiedCount,
          message:
            result.modifiedCount > 0
              ? "Profile updated successfully."
              : "No changes made.",
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Something went wrong during update.",
        });
      }
    });

    // plants related API
    app.get("/plant/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await plantsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(401).send({});
      }
    });

    app.get("/myplants/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await plantsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/plants", async (req, res) => {
      const sortBy = req.query.sortBy;
      const category = req.query.category;

      const filter = {};
      if (category) {
        filter.category = category;
      }

      let cursor = plantsCollection.find(filter);

      if (sortBy === "nextWatering") {
        cursor = cursor.sort({ nextWatering: 1 });
      }

      let result = await cursor.toArray();

      if (sortBy === "careLevel") {
        const careOrder = { easy: 1, moderate: 2, difficult: 3 };
        result.sort((a, b) => careOrder[a.careLevel] - careOrder[b.careLevel]);
      }

      res.send(result);
    });

    app.get("/newplants", async (req, res) => {
      const cursor = { createdAt: -1 };
      const result = await plantsCollection
        .find()
        .sort(cursor)
        .limit(8)
        .toArray();
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

    app.delete("/plantdelate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/upcoming-plants/:email", async (req, res) => {
      const { email } = req.params;

      // Get today's date and next 3 days range
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // "2025-06-27"

      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);
      const threeDaysLaterStr = threeDaysLater.toISOString().split("T")[0];

      try {
        const upcomingPlants = await plantsCollection
          .find({
            email: email,
            nextWatering: {
              $gte: todayStr,
              $lte: threeDaysLaterStr,
            },
          })
          .sort({ nextWatering: 1 })
          .toArray();

        res.send(upcomingPlants);
      } catch (error) {
        console.error("Error fetching upcoming watering plants:", error);
        res
          .status(500)
          .send({ error: "Failed to fetch upcoming watering plants" });
      }
    });

    // Feedback related API
    app.get("/feedback", async (req, res) => {
      const result = await feedbackCollection.find().toArray();
      res.send(result);
    });

    app.post("/feedback", async (req, res) => {
      const cursor = req.body;
      const result = await feedbackCollection.insertOne(cursor);
      res.send(result);
    });

    app.post("/contact-info", async (req, res) => {
      try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
          return res.status(400).json({ error: "All fields are required." });
        }

        const contactData = {
          name,
          email,
          message,
          createdAt: new Date(),
        };

        const result = await contactCollection.insertOne(contactData);
        res.status(201).json({ success: true, insertedId: result.insertedId });
      } catch (err) {
        console.error("Error saving contact message:", err.message);
        res.status(500).json({ error: "Server error. Try again later." });
      }
    });

    // stats related Api
    app.get("/dashboard-stats", async (req, res) => {
      try {
        const plantCount = await plantsCollection.countDocuments();
        const feedbackCount = await feedbackCollection.countDocuments();

        res.json({
          plants: plantCount,
          feedbacks: feedbackCount,
        });
      } catch (error) {
        console.error("Dashboard error:", error.message);
        res.status(500).json({ error: "Server Error" });
      }
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
