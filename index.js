const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection = await client.db('testdb').collection('users');

        // User routes
        app.post('/user', async (req, res) => {
            const user = req.body;
            const isUserExist = await usersCollection.findOne({ email: user?.email });
            if (isUserExist?._id) {
                return res.send({
                    status: "success",
                    message: "Login success",
                });
            }
            const result = await usersCollection.insertOne(user);
            res.send({ success: true, data: result });
        })

        app.get('/user', async (req, res) => {
            const result = await usersCollection.find({}).toArray();
            res.send(result);
        })

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const result = await usersCollection.findOne({ email: email });
            res.send(result);
        })

        app.patch('/user/:id', async (req, res) => {
            const { id } = req.params;
            const body = req.body;
            const updateDoc = {
                $set: body
            };
            const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);

            res.send(result);
        })


        // Events routes
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
        app.get('/event/:id', async (req, res) => {
            const { id } = req.params;
            const result = await eventsCollection.findOne({ _id: new ObjectId(id) });
            res.send(result)
        })

        app.patch('/event/:id', async (req, res) => {
            const { id } = req.params;
            const body = req.body;
            const updateDoc = {
                $set: body
            };
            const result = await eventsCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);

            res.send(result);
        })
        app.delete('/event/:id', async (req, res) => {
            const { id } = req.params;
            const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result)
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