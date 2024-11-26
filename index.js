const fs = require('fs')
const csv = require('csv-parse')
const express = require('express');
const app = express()
const port = 3000;

let heroes = [];

// create a reader for csv file
const parser = csv.parse(
	{ columns: true }, 
	function(err, records){
		heroes = records;
	}
);

// read csv file as a stream
fs.createReadStream(__dirname + '/superheroes.csv').pipe(parser);

// server return static files from the "public" folder
app.use(express.static('public'));

app.get('/', 
	(req, res) => {
		res.send('<h1>Welcome to our awesome Superhero API!</h1>');
	}
);

app.get('/heroes',
	(req, res) => {
		res.send(heroes);
	}
);
app.get('/search/:term', (req, res) => {
	const term = req.params.term;
	// debugging
	console.log('Received search term:', term);
	let selected = [];
	//TODO: Return a list of heros that satisfy the user request
	try {
	  heroes.forEach(hero => {
		if (hero.Name && typeof hero.Name === 'string' && hero.Name.toLowerCase().includes(term.toLowerCase())) {
		  selected.push(hero);
		}
	  });
	  res.json(selected);
	  //debugging
	} catch (error) {
	  console.error('Error processing search:', error);
	  res.status(500).send({ error: 'Internal server error' });
	}
});


app.listen(port, () => {
	console.log("I've become aware.");
});
