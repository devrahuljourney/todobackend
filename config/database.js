const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    console.log("Before MongoDb url connection")
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Db connect successfully');
    })
    .catch((e) => {
        console.log('Error in db connection ', e);
    });
};
