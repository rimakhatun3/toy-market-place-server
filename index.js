const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




require('dotenv').config()
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvicmmt.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
const toyCollection  = client.db('toyMarketplace').collection('toys')


app.post('/alltoys',async(req,res)=>{
    const body = req.body
    console.log(body)
    const result = await toyCollection.insertOne(body)
    res.send(result)
})

app.get('/alltoys',async(req,res)=>{
    const result =await toyCollection.find().limit(20).toArray()
    res.send(result)
})

app.get('/alltoys/:text',async(req,res)=>{
    const text = req.params.text;
    const filter = {category:text}
    const result = await toyCollection.find(filter).toArray()
    res.send(result)

})


app.get('/alltoy/:id',async(req,res)=>{
  const id = req.params.id

  const query ={_id : new ObjectId(id)}
const result = await toyCollection.findOne(query)
console.log(result)
res.send(result)

})

app.get('/toys',async(req,res)=>{

  const type = req.query.type
  const value = req.query.value
  console.log(type,value)

  let query = {}
  if(req.query.email){
    query = {sellerEmail:req.query.email}
  }
  const result = await toyCollection.find(query).sort({price : 1}).toArray()
  console.log(result)
  res.send(result)
})

app.patch('/mytoy/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id : new ObjectId(id)}
  const newUpdate = req.body
  const updateDoc ={
    $set:{
    price: newUpdate.price,
    detail :newUpdate.detail,
    quantity : newUpdate.quantity
    }
  }

  const result = await toyCollection.updateOne(filter,updateDoc)
  res.send(result)
  
})


app.delete('/mytoys/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await toyCollection.deleteOne(query)
  res.send(result)
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('toys is running')
})


app.listen(port,()=>{
    console.log(`port in running on ${port}`)
})