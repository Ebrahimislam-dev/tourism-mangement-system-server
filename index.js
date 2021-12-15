const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express();


//midleware
app.use(cors())
app.use(express.json());

//Mongo db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b67bk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        // console.log('database connected');
        const database = client.db('travelmama');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');



        // get Api Services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //get single service data api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //post api services
        app.post('/services', async (req, res) => {
            const service = req.body;

            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        //service delete Api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
        // Add Order api
        app.post("/order", async (req, res) => {
            console.log(req.body);
            const result = await orderCollection.insertOne(req.body);
            result.displayName = "mrx";

            // console.log(result.);
            res.send(result2);
        });

        // my order api

        app.get("/myorder/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });


        // get all orders api

        app.get("/allorder", async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });



        //order delete Api
        app.delete('/allorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("hello from  Travel-Mama node server")
});


app.listen(port, () => {
    console.log('listing to travel-mama  port', port);
});