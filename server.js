// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const dataStore = require('nedb');
const cors = require('cors');
const momentJS = require('moment');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
momentJS.locale('id');

var db = new dataStore({filename: 'path/to/file.json', autoload: true});

// http://expressjs.com/en/starter/basic-routing.html
/**
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
*/

app.get('/', (req,res)=>{
  db.find({}, (err,data)=>{
    if(err)
      throw err;
    else
      res.send(data);
  })
})

app.post('/', (req,res)=>{
  let day = momentJS().format('LLLL');
  let doc = { ...req.body, day };
  db.insert(doc,(err,data)=>{
    if(err)
      throw err
    else
      res.send('data has posted')
  })
})

app.get('/:id', (req,res)=>{
  db.findOne({_id: req.params.id}, {}, (err,data)=>{
    if(err)
      throw err
    else
      res.send(data)
  })
})

app.put('/:id',(req,res)=>{
  let day = momentJS().format('LLLL');
  let doc = { ...req.body, day };
  db.update({_id: req.params.id}, doc, {}, (err,data)=>
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
