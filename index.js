var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var place_table = 'place';
var pokemon_table = 'pokemon';

var app = express();

app.use(express.static(__dirname + '/app'));

app.get('/places.json', function(req, res) {
  db.all('SELECT * FROM ' + place_table +
    ' WHERE latitude >= ? AND latitude < ? AND longitude >= ? AND longitude < ?' + ' LIMIT 500',
    req.query.min_latitude,
    req.query.max_latitude,
    req.query.min_longitude,
    req.query.max_longitude,
    function(err, rows) {
      res.send(rows);
  });
});

app.get('/pokemons.json', function(req, res) {
  var timestamp = Date.now() / 1000 | 0;
  db.all('SELECT * FROM ' + pokemon_table + 
    ' WHERE latitude >= ? AND latitude < ? AND longitude >= ? AND longitude < ? AND despawn > ?' + ' LIMIT 500',
    req.query.min_latitude,
    req.query.max_latitude,
    req.query.min_longitude,
    req.query.max_longitude,
    timestamp,
    function(err, rows) {
      res.send(rows);
  });
});

var port = 12026;
app.listen(port, function() {
  console.log('Server is started.');
  console.log('Listening on ' + port);
});

process.on('SIGINT', function() {
  db.close();
  process.exit();
});
