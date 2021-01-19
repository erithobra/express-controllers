# Express Controllers

**Quick Recap:** What is MVC? Why do we need it?

## Code Along
We will continue to work on `fruit-app`. So far we have models and views built and our app does a full CRUD on fruits.

### Create External Controller File

So far in our `fruit-app` we have a model which interacts with the data, we have views which has all our EJS files but we don't have controllers yet. 


So in order to follow MVC architecture, we will start by creating `controllers` folder under `fruit-app`.

1. `mkdir controllers`
1. `touch controllers/fruits.js`


Let's leave it at this for now. We have to got to set up aur routes before that.

### Create Routes

Before we go ahead with controllers let's use Express Router to create some routes. What we are looking to do here is reduce the amount of code `server.js` has in order to make our app more maintainable.

1. `mkdir routes`
2. `touch routes\fruits.js`

Edit this file to add,

```javascript
const express = require('express');
const router = express.Router();

module.exports = router;
```

`express.Router()` creates a new router object. A [router](https://expressjs.com/en/api.html#router) object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.	

Before we move away from here, let's add another file `index.js` under `routes` dir, `touch routes\index.js`. This will export fruits route or any other route file we create.

```
module.exports = {
    fruits: require('./fruits')
}
```

### Back to fruits Controller

We are going to start with our homepage and add the method that renders it in `controllers/fruits.js`. Add fruit model in the controller.

```
const fruits = require('../models/fruits.js')

const index = (req, res) => {
    res.render('index.ejs', {
        fruits : fruits
    });
};
  
module.exports = {
    index
};
```

While we are here, just like with routes we will add `touch controllers/index.js` to export all our controllers.

```
module.exports = {
    fruits: require('./fruits')
}
```

Let's briefly go back to `routes/fruits.js` and add the controller that router will send the request to.

```
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

router.get('/', ctrl.fruits.index);

module.exports = router;
```

### Update Server.js to Routes

For now we will start by importing `routes/fruits.js` to `server.js` and removing the earlier code.

```
const routes = require('./routes');

app.use('/fruits', routes.fruits)
```

What we are saying here is all the requests starting from `/fruits` will be handled by `fruits.js` routes. Which will further pass it on to the appropriate controller.

Make sure to save all the changes and restart server if not running already. Open the homepage [http://localhost:3000/fruits](http://localhost:3000/fruits) in the browser.

## You Do then We Do

Now that you have seen the whole flow for one route, let's make similar change for another route  `/fruits/:index` where if requested we return `show.ejs`. Remember start with controller, then update the routes.

Also, don't forget to export the funtions in the controller.


## Update Routes to Create a New Fruit


### Start with Controller

```javascript
const renderNew = (req, res) => {
    res.render('new.ejs');
}

const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    
    res.redirect('/fruits');
}
```

#### Export them

```
module.exports = {
    index,
    renderNew,
    postFruit,
    show
}
```

### Update Routes

```
router.get('/new', ctrl.fruits.renderNew);
router.post('/', ctrl.fruits.postFruit);
```

### Remove above routes from server.js


## Independent Practice
So far we have show and create in our controller. Let's refactor all the remaining routes to controller and routes. And keep updating `server.js`


A the end the `Fruit` model is no longer needed in `server.js`.  So make sure to remove it.


## Finally Controller, Routes & Server.js will look like

### controllers/fruits.js

```
const fruits = require('../models/fruits.js')

const index = (req, res) => {
    res.render('index.ejs', {
        fruits : fruits
    });
};

const show = (req, res) => {
    res.render('show.ejs', {
        fruit: fruits[req.params.index]
    });
}

const renderNew = (req, res) => {
    res.render('new.ejs');
}

const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    
    res.redirect('/fruits');
}

const renderEdit = (req, res) => {
    res.render(
		'edit.ejs', //render views/edit.ejs
		{ //pass in an object that contains
			fruit: fruits[req.params.index], //the fruit object
			index: req.params.index //... and its index in the array
		}
	);
}

const editFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
	fruits[req.params.index] = req.body; //in our fruits array, find the index that is specified in the url (:index).  Set that element to the value of req.body (the input data)
	res.redirect('/fruits'); //redirect to the index page
}

const deleteFruit = (req, res) => {
    fruits.splice(req.params.index, 1); //remove the item from the array
	res.redirect('/fruits');  //redirect back to index route
}
  
module.exports = {
    index,
    renderNew,
    postFruit,
    show,
    renderEdit,
    editFruit,
    deleteFruit
  };
  
```

### routes/fruits.js

```
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

router.get('/new', ctrl.fruits.renderNew);
router.get('/', ctrl.fruits.index);
router.get('/:index', ctrl.fruits.show);
router.post('/', ctrl.fruits.postFruit);
router.get('/:index/edit', ctrl.fruits.renderEdit);
router.put('/:index', ctrl.fruits.editFruit);
router.delete('/:index', ctrl.fruits.deleteFruit);

module.exports = router;
```

### server.js

```
const express = require('express');
const fruits = require('./models/fruits');
const methodOverride = require('method-override');
const routes = require('./routes');

const app = express();

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));

app.use('/fruits', routes.fruits)

app.listen(3000, ()=>{
    console.log('I am listening on port 3000');
});
```

<br>

## Serve Static files

Finally, let's add some CSS to our app. First, we need to tell express where to look for static files in general (css, front-end js files, fonts, images, etc.). In `server.js` add this middleware above all the others.

```js
app.use(express.static("public"));
```

Then, in the root of the app create a `public` folder. our html is already lookling for a `css/app.css` file, so create a `css` folder and `app.css` inside.

![](https://i.imgur.com/XIvl3C4.png)

Add a simple rule to `public/css/app.css`to confirm it's working!

```css
body {
  color: red;
}
```

Link this css in `index.ejs`

```
<head>
    <meta charset="utf-8" />
    <title></title>
    <link rel="stylesheet" href="/css/app.css" />
</head>
```

<br>

![](https://media.giphy.com/media/8JW82ndaYfmNoYAekM/giphy.gif)
