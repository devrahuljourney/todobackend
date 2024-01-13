require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const cookieParser = require("cookie-parser");

// port number
const PORT = process.env.PORT || 3000;

console.log("this is port number ", PORT);
app.use(cookieParser());
app.use(express.json());

console.log("connected database from index");

// Fix the require statement for the database connection
require("./config/database").connect(); // assuming your database configuration is in a 'config' folder

// we take the route from route file and mount it in api v1
const user = require('./routes/user');
app.use('/api/v1', user);

// now we activate the server on the port number
try {
    app.listen(PORT, () => {
        console.log(`app is running on port Number ${PORT}`);
    });
} catch (error) {
    console.log('error in connecting database', error);
}
