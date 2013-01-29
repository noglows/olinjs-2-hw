
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

var colors;
var colorIndex;
var ranColor;
var names;
var nameIndex;
var ranName;
var ranAge;

mongoose.connect('localhost', 'test');

var catSchema = mongoose.Schema({
  age: Number,
  color: String,
  name: String
});

var Cat = mongoose.model('Cat', catSchema);



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/cats/new', function(req, res) {
  //res.send('this page should create a new cat'), 

  //random color
  colors = ['black', 'brown', 'white', 'grey', 'purple'];
  colorIndex = Math.floor(Math.random() * colors.length);
  ranColor = colors[colorIndex];

  //random age from 0 to 20
  ranAge = Math.floor(Math.random()*20);

  //random names
  names = ['Jack', 'Jill', 'Keely', 'Jordyn', 'Jessica', 
    'Tim', 'David', 'Jialiya', 'Andrew', 'Aaron', 'Cory'];
  nameIndex = Math.floor(Math.random() * names.length);
  ranName = names[nameIndex];

  var newCat = new Cat({age: ranAge, color: ranColor, name: ranName });
  res.send('You added a new cat!' + newCat);
  newCat.save(function (err) {
    if(err)
      console.log("Problem saving cat", err);
    })
});

app.get('/cats', function(req, res) {
  //res.send('this page should give a sorted list of cats by age')

  Cat.find({}).sort('+ age')
      .exec(function(err, cats) {
        if (err) {};
        res.send(cats);        
      });
});

app.get('/cats/color/:color', function(req, res) {
  //res.send('this page should give a sorted list by age with color')
  Cat.find({color: req.params.color}).sort('+ age')
    .exec(function(err, cats) {
      if (err) {};
      res.send(cats);
    });

});

app.get('/cats/delete/old', function(req, res) {
  //res.send('this page should delete the oldest cat')

  Cat.find().sort('- age').limit(1).exec(function (err, cats) {
    if (err) return console.log("error", err);
    Cat.findOne().where('_id', cats[0]._id).remove();
    res.send("removed a fucking cat");
  });
   
});
    
    



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
