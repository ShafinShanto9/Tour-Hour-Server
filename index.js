const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8oki3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
client.connect(err => {
    const ServiceCollection = client.db("service").collection("package");
    const PackageOrderCollection = client.db("service").collection("order")
// add add services
  app.post("/addservice", async (req, res) => {
    console.log(req.body);
    const result = await ServiceCollection.insertOne(req.body);
    console.log(result);
  });

//   get services
  app.get("/allservice", async (req, res) => {
    const result = await ServiceCollection.find({}).toArray();
    res.send(result);
  })

  // ADD orders package
  app.post('/booking' , async(req , res) => {
    const result  = await PackageOrderCollection.insertOne(req.body)
    res.send(result)
  })

  // Show Packages 
  app.get("/allpackage" , async (req, res) => {
    const result = await PackageOrderCollection.find({}).toArray()
    res.send(result)
  })
// Delete Package
    app.delete("/deleteEvent/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await PackageOrderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // My Packages
    app.get("/mypackages/:email", async (req, res) => {
      const result = await PackageOrderCollection.find({
        email: req.params.email,
      }).toArray();
      res.send(result);
    });

});


app.listen(process.env.PORT || port);