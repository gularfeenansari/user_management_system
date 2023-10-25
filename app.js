require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path')
const hbs = require('hbs');
const db = require('./database/databaseConnection');
const router = require('./routes/index');

//setting up templating engine
app.set('view engine', 'hbs');

//static files
app.use('/public',express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views')); 

//middlewares to parse data
app.use(express.urlencoded());
app.use(express.json());

app.use(router);


// Setting up server
app.listen(process.env.port,()=>{
    console.log('Server running...');
})