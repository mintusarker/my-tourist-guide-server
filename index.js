const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dl1tykd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const serviceCollection = client.db('TouristGuide').collection('services', 'service');
    const reviewCollection = client.db('TouristGuide').collection('reviews');


    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    app.get('/service', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //review API
    app.get('/review', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }

      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });


    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);

    })

    app.put('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          message: user.message
        }
      }
      const result = await reviewCollection.updateOne(query, updatedUser, option);
      res.send(result)
    })

    app.delete('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result)
    })

  }
  finally {

  }
}

run().catch(error => console.error(error))


app.get('/', (req, res) => {
  res.send('travel guide server running')
})

app.listen(port, () => {
  console.log(`Travel guide server running on ${port}`)
})