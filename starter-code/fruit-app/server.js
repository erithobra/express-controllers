const express = require('express');
const fruits = require('./models/fruits');
const methodOverride = require('method-override');

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.get('/fruits', (req, res) => {
    res.render('index.ejs', {
        fruits: fruits
    })
})

app.post('/fruits', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    res.redirect('/fruits');
});

app.get('/fruits/new', (req, res) => {
    res.render('new.ejs');
});

//API to send the fruit back to the user if user sends the index of the fruit
app.get('/fruits/:index', (req, res) => {
    // res.send(`The fruit you asked for is ${fruits[req.params.index]}`);
    res.render('show.ejs', {
        fruit: fruits[req.params.index]
    })
})

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

app.delete('/fruits/:index', (req, res) => {
	fruits.splice(req.params.index, 1); //remove the item from the array
	res.redirect('/fruits');  //redirect back to index route
});

app.listen(3000, () => {
    console.log('I am listening on port 3000');
})