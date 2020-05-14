const express = require('express');
const app = express();//app is an object

const bodyParser = require('body-parser');

const methodOverride = require('method-override');

const fruits = require('./models/fruits.js')

app.use(bodyParser.urlencoded({extended:false}));

app.use(methodOverride('_method'));

app.get('/fruits/new', (rew, res) => {
    res.render('new.ejs');
});

app.get('/fruits', (req, res) => {
    res.render('index.ejs', {
        fruits : fruits
    });
});

app.get('/fruits/:index', (req, res) => {
    res.render('show.ejs', {
        fruit: fruits[req.params.index]
    });
});

app.get('/fruits/:index/edit', function(req, res){
	res.render(
		'edit.ejs', //render views/edit.ejs
		{ //pass in an object that contains
			fruit: fruits[req.params.index], //the fruit object
			index: req.params.index //... and its index in the array
		}
	);
});

app.put('/fruits/:index', (req, res) => { //:index is the index of our fruits array that we want to change
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
	fruits[req.params.index] = req.body; //in our fruits array, find the index that is specified in the url (:index).  Set that element to the value of req.body (the input data)
	res.redirect('/fruits'); //redirect to the index page
});

app.post('/fruits', (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    console.log(fruits);
    res.redirect('/fruits');
});

app.delete('/fruits/:index', (req, res) => {
	fruits.splice(req.params.index, 1); //remove the item from the array
	res.redirect('/fruits');  //redirect back to index route
});

app.listen(3000, ()=>{
    console.log("listening");
});
