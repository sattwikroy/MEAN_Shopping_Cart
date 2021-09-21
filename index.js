const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const auth_router= require('./router/authRouter.js');
const product_router= require('./router/ProductRouter.js');
const order_router= require('./router/orderRouter.js');
const config = require('./config/database');
const port = process.env.PORT || 3000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Connect to Database 
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () =>{
    console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) =>{
    console.log('Database error ' + err);
});

// Body Cors Middleware
app.use(cors()); 


//Creat Static Folder
app.use(express.static('public'))


// Body Parser Middleware
app.use(bodyParser.json());

//Routers
app.use('/',auth_router);
app.use('/product',product_router);
app.use('/order',order_router);

// Other Routes
app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
})

//Passport Initialize
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Set Static Folder
app.use(express.static('public'))

// Start server
app.listen(port)