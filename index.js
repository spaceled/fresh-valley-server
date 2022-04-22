const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const ObjectId = require('ObjectId');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId ;
const cors = require('cors');
require('dotenv').config();

const { ObjectID } = require('bson');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.azz4g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const cartCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_CART}`);

  // Loading All products from DataBase
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray( (err, products) => {
      res.send(products)
    });
  });

  app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    productCollection.find({_id:ObjectId(id)})
    .toArray( (err, products) => {
      res.send(products[0]);
    });
  });

  // Loading Products to Cart from DataBase
  app.get('/checkout', (req, res) => {
    cartCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    });
  });

  app.get('/orders', (req, res) => {
    cartCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    });
  });

  app.get('/order/:email', (req, res) => {
    const email = req.params.email;
    cartCollection.find({email: email})
    .toArray((err, documents) => {
      res.send(documents)
    });
  });

  // Add Products to DataBase
  app.post('/addProduct', (req, res) => {
    const productAdding = req.body;
    console.log('adding new event', productAdding)
    productCollection.insertOne(productAdding)
    .then(result => {
      console.log('Inserted', result.insertedCount)
      res.send(result.insertedCount > 0)
    });
  });

  // add one product to Cart db
	app.post('/checkout', (req, res) => {
		const addToCheckout = req.body;
		cartCollection.insertOne(addToCheckout)
		.then((result) => {
      console.log('Inserted', result.insertedCount)
				res.send(result.insertedCount);
			})
		.catch((err) => {
				console.log(err.code);
			});
	});

  app.delete('/deleteCheckout/:id', (req, res) => {
    const id = req.params.id;
    cartCollection.deleteOne({_id: ObjectId(id)}, err => {
      if (!err) {
        res.send({count: 1})
      }
    });
  });
//   client.close();
});


app.listen(port)