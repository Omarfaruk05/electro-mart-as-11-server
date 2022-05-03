const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        
        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.send(product);
        })
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


