var express = require('express');
const url = require('url');
var app = express();
var cors = require('cors')
app.use(cors())
// for parsing the body in POST request
var bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const {MongoClient}=require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const collection = client.db("admin").collection("Users");
  // perform actions on the collection object
var users =[];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/users', function(req, res){
    collection.find({}).toArray((error, documents) => {
        if (error) {
          console.log(error);
        } else {
          res.send(documents);
        }
      }); 
});

app.get('/api/users/:id', function(req,res){
  collection.findOne({_id:ObjectId(req.params.id)}, (error, documents) => {
    if (error) {
      console.log(error);
    } else {
      res.send(documents);
    }
  }); 
})

app.post('/api/users', function (req, res) {
  var user=req.body;
    collection.insertOne(user, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.send(result)
          console.log('Document inserted successfully');
        }
      });
});

app.put('/api/users', function(req,res){
  var user1=req.body;
  var _ids=req.body._id;
  delete user1._id;
  console.log(user1)
  // collection.updateOne({_id: ObjectId(_id)},{$set:user}, (err, result) => {
  //   if(result){
  //     console.log(result)
  //     res.send(result)
  //   }
  // })
  _ids=_ids.map(ele =>{return ObjectId(ele)});
  collection.updateMany({_id: {$in :_ids}},{$set:user1},(err,result)=>{
    if(result){
      console.log(result.modifiedCount)
      res.send(result)
    }else{
      console.log(err)
    }
  })
})

app.post('/api/users/delete', function(req,res){
  var ids = req.body;
  console.log(ids)
  ids = ids.map(id => {return ObjectId(id)});
  console.log(ids)
  collection.deleteMany({_id: { $in: ids }}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send({mess:'Document deleted successfully'})
      console.log('Document deleted successfully',result);
    }
  });
});

app.post('/login', function(req,res){
  const cred=client.db("admin").collection("credentials")
  cred.insertOne(req.body,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})

app.listen('3000', function(){
    console.log('Server listening on port 3000');
});