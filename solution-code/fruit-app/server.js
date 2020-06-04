//imported express library
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();//returns an object
const fruits = require('./models/fruits');
const routes = require('./routes');

//middleware- every request goes through it
//using body parser to parse request data
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));
//adding router object to middleware
app.use('/fruits', routes.fruits);

//app will run on port 3000
app.listen(3000, () => {
    console.log('I am listening');
})
