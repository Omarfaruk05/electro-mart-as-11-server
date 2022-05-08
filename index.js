const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

//electroMart
//QXSy6evzp9RpaJyK


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muwf8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const productsCollection = client.db('electro-mart').collection('products');

        app.post('/login', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            })
            res.send({token});
        })
        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/addedProduct', async(req, res) => {
            const email = req.query;
            const query = email;
            console.log(query)
            const cursor = productsCollection.find(query);
            const addedProducts = await cursor.toArray();
            res.send(addedProducts);
        });

        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.send(product);
        });

        app.post('/product', async(req, res)=> {
            const newService = req.body;
            const result = await productsCollection.insertOne(newService);
            res.send(result);
        });

        app.put('/product/:id', async(req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            console.log(updatedQuantity)
            const fliter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set:{
                    quantity : updatedQuantity.quantity
                }
            };
            const result = await productsCollection.updateOne(fliter, updatedDoc, options);
            res.send(result);

        })

        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result =  await productsCollection.deleteOne(query);
            res.send(result);
        });
    }

    finally{

    }
};

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running electro mart')
});

app.listen(port, () => {
    console.log('listening to port', port)
})


