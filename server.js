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

var db = new dataStore({
  filename: 'path/to/file.json',
  autoload: true
});

// http://expressjs.com/en/starter/basic-routing.html
/**
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
*/

app.get('/', (req, res) => {
  db.find({}, (err, data) => {
    if (err)
      throw err;
    else
      res.send(data);
  })
})

app.post('/', (req, res) => {
  let day = momentJS().format('LLLL');
  let doc = { ...req.body,
    day
  };
  // empty handle data
  if (
    req.body.name == null ||
    req.body.nim == null ||
    req.body.phone == null ||
    req.body.gender == null ||
    req.body.email == null ||
    req.body.faculty == null
  ) {
    res.status(301).json({
      status_code : 301,
      message : 'please fill all form!'
    })
  } else {
    db.insert(doc, (err, data) => {
      if (err)
        throw err
      else
        res.status(200).json({
          status_code: 200,
          message : 'data saved!'
        })
    })
  }
})

app.get('/:id', (req, res) => {
  db.findOne({
    _id: req.params.id
  }, {}, (err, data) => {
    if (err)
      throw err
    else
      res.send(data)
  })
})

app.put('/:id', (req, res) => {
  let day = momentJS().format('LLLL');
  let doc = { ...req.body,
    day
  };
  db.update({
    _id: req.params.id
  }, doc, {}, (err, data) => {
    if (err)
      throw err
    else
      res.send('Your data has been updated')
  })
})

app.delete('/:id', (req, res) => {
  db.remove({
    _id: req.params.id
  }, {}, (err, data) => {
    if (err)
      throw err
    else
      res.send('Your data has been deleted')
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});