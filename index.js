const express = require("express");
const cors = require('cors'); // Import the cors package
const app = express();

require('dotenv').config(); // .env-config

const connectToDatabase  = require('./db'); //Database-connection-code
connectToDatabase(); //Database-connection-intialise

// Middlewares:
app.use(express.json());
app.use(cors({
    origin: 'place', // Replace with your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'],
}));

// Routing:
app.use('/auth', require('./routes/auth'));
app.use('/expenses', require('./routes/expense'));

app.listen(process.env.PORT, ()=>{
    console.log("Server is Running");
})
