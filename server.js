// -- EXPRESS --
var express = require('express');
var app = express();

// -- STATIC PATH
var path = require('path');
app.use(express.static( __dirname + "/public/dist/public"));

// -- SET the VIEW path
// app.set('views', path.join(__dirname, './views'));
// app.set('view engine', 'ejs'); //using EJS

// -- BODY-PARSER
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// -- MONGOOSE --
var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/restful', { useNewUrlParser: true }).then(
  (res) => {
    console.log("Connected to Database Successfully.")
  }
).catch(() => {
  console.log("Conntection to database failed.");
});

// -- SCHEMA --
var TaskSchema = new mongoose.Schema({
 title:{
   type: String,
   required: true,
   default:""
 },
 description:{
   type: String,
   required: true,
   default:""
 },
 completed:{
   type: Boolean,
   default: false
 }

},
 {timestamp: true}
)
mongoose.model('Task', TaskSchema); // We are setting this Schema in our Models as 'User'
var Task = mongoose.model('Task') // We are retrieving this Schema from our Models, named 'User'


// -- ROUTES --

// .GET: Retrieve all tasks
app.get('/tasks',function(req,res){
  Task.find({},function(err, task){
    if(err){
      res.json({message: "Failure", error: err});
    }
    else{
      res.json({message: "Success", data: task});
    }
  })
})

// .GET: Retrieve a task by ID
app.get('/tasks/:id', function(req,res){
  Task.findOne({_id: req.params.id}, function(err, task){
    if(err){
      res.json({message: "Failure", error:err})
    }
    else{
      res.json({message: "Success", data: task})
    }
  })
})

// .POST: Create a task
app.post('/tasks',function(req,res){
  Task.create(req.body, function(err, task){
    if(err){
    console.log("error")
    res.json({message: "Failure", error:err})
    }
    else{
    res.json({message: "Success", data: task})
    }
  })
})

// .Put: Update Tasks
app.put('/tasks/:id',function(req,res){
    Task.update({_id:req.params.id}, req.body, function(err, task){
      if(err){
        res.json({message: "Failure"})
      }
      else{
        res.json({message: "Success", data: task})
      }
    })
})

// .Delete: Delete Tasks
app.delete('/tasks/:id', function(req,res){
  Task.deleteOne({_id: req.params.id}, function(err, task){
    if(err){
      res.json({message: "Failure"})
    }
    else{
      res.json({message: "Success", data: task})
    }
  })
})

app.listen(8000);
