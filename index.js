const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ls5ir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const eventsCollection = await client.db('testdb').collection('events');

        app.post('/event', async (req, res) => {
            const data = req.body;
            const result = await eventsCollection.insertOne(data);
            res.send({ success: true, data: result });
        })

        app.get('/event', async (req, res) => {
            // const query = req.query;
            const result = await eventsCollection.find({}).toArray();
            res.send(result)
        })

        app.patch('/event/:id', async (req, res) => {
            const {id} = req.params;
            const body = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    body
                },
            };
            const result = await eventsCollection.updateOne({ _id: id }, updateDoc, options);
            res.send(result);
        })


        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Welcome to the Express server!");
})

app.listen(PORT, (req, res) => {
    console.log(`Server is running at port ${PORT}`);
})

//
// 