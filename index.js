const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();

//middleware
const cors = require("cors");
app.use(cors());
//body parser
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmdfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("click_flick");
    const reviewCollection = database.collection("reviews");
    const productCollection = database.collection("products");
    const cartCollection = database.collection("cart");
    const wishlistCollection = database.collection("wishlist");

    //get review
    app.get("/reviews", async (req, res) => {
      //finds the reviews from mongodb server
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // post review
    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      // newReview.id = reviews.length;
      const result = await reviewCollection.insertOne(newReview);
      // reviews.push(newReview);
      console.log(req.body);
      res.json(result);
    });

    //get product
    app.get("/products", async (req, res) => {
      const findProduct = productCollection.find({});
      const products = await findProduct.toArray();
      res.send(products);
    });

    //post to cart
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      const addtoCart = await cartCollection.insertOne(cart);
      console.log(req.body);
      res.json(addtoCart);
    });

    //get cart
    app.get("/cart", async (req, res) => {
      const findCart = cartCollection.find({});
      const addedtoCart = await findCart.toArray();
      res.send(addedtoCart);
    });

    //delete from cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      query = { _id: ObjectId(id) };
      const deletedItem = await cartCollection.deleteOne(query);
      res.json(deletedItem);
    });

    //delete from wishlist
    app.delete("/wishlist/:id", async (req, res) => {
      const wishlistId = req.params.id;
      query = { _id: ObjectId(wishlistId) };
      const deleteWishlist = await wishlistCollection.deleteOne(query);
      res.json(deleteWishlist);
    });

    //post to wishlist
    app.post("/wishlist", async (req, res) => {
      const wishlist = req.body;
      const addtoWishlist = await wishlistCollection.insertOne(wishlist);
      console.log(req.body);
      res.json(addtoWishlist);
    });

    //get wishlist
    app.get("/wishlist", async (req, res) => {
      const findWishlist = wishlistCollection.find({});
      const myWishlist = await findWishlist.toArray();
      res.send(myWishlist);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running clickFlick server!");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
