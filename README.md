# Express Router

## Lesson Objectives

1. Explain What Express.Router does for us
1. Create External Controller File for Routes
1. Move Server.js Routes to External Controller File
1. Use Controller File in Server.js
1. Remove References to Base of Controller's URLs

## Explain What Express.Router does for us

- Our server.js file is getting rather bloated
- express.Router will let us put our routes in a separate file

## Create External Controller File for Routes

So far in our `fruits-app` we have a model which interacts with the data, we have views which has all our EJS files but we don't have controllers yet. 

**Quck Recap:** What is MVC? Why do we need it?

So in order to follow MVC archotecture, we will start by creating `controllers` folder under `fruits-app`.

1. `mkdir controllers`
1. `touch controllers/fruits.js`
1. Edit controllers/fruits.js

```javascript
const express = require('express');
const router = express.Router();

module.exports = router;
```

## Move Server.js Routes to External Controller File

rename `app` to `router`

```javascript
const express = require('express');
const router = express.Router();

router.get('/fruits/new', (req, res)=>{
    res.render('new.ejs');
});

router.post('/fruits/', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
   
        res.redirect('/fruits');
   
});

router.get('/fruits', (req, res)=>{
    
        res.render('index.ejs', {
            fruits: Fruits
        });

});

router.get('/fruits/:id', (req, res)=>{
   
        res.render('show.ejs', {
            fruit: Fruit[req.params.id]
        });
   
});

router.delete('/fruits/:id', (req, res)=>{
        Fruits.splice(req.params.id,1)
        res.redirect('/fruits')
 
});

router.get('/fruits/:id/edit', (req, res)=>{
    Fruit.findById(req.params.id, (err, foundFruit)=>{ //find the fruit
        res.render(
    		'edit.ejs',
    		{
    			fruit: foundFruit //pass in found fruit
    		}
    	);
    });
});

router.put('/fruits/:id', (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    
    Fruit[req.params.id] = req.body
    res.redirect('/fruits');
 
});

module.exports = router;
```

## Require Fruit Model in Controller File

```javascript
const express = require('express');
const router = express.Router();
const Fruit = require('../models/fruits.js')
//...
```

The `Fruit` model is no longer needed in `server.js`.  Remove it:

```javascript
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
```

## Use Controller File in Server.js

```javascript
const fruitsController = require('./controllers/fruits.js');
app.use('/fruits', fruitsController);
```

## Remove References to Base of Controller's URLs

Since we've specified that the controller works with all urls starting with /fruits, we can remove this from the controller file:

```javascript
const express = require('express');
const router = express.Router();

router.get('/new', (req, res)=>{
    res.render('new.ejs');
});

router.post('/', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    Fruit.push(req.body)
    res.redirect('/fruits');

});

router.get('/', (req, res)=>{
    
    res.render('index.ejs', {
        fruits: Fruits
    });
  
});

router.get('/:id', (req, res)=>{
    
    res.render('show.ejs', {
        fruit: Fruit[req.params.id]
    });
   
});

router.delete('/:id', (req, res)=>{
   Fruits.splice(req.params.id, 1);
   res.redirect('/fruits');
  
});

router.get('/:id/edit', (req, res)=>{
   
        res.render(
    		'edit.ejs',
    		{
    			fruit: Fruits[req.params.id] //pass in found fruit
    		}
    	);

});

router.put('/:id', (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    
    Fruits[req.params.id] = req.body
    
    res.redirect('/fruits');
 
});

module.exports = router;
```
