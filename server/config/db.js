const mongoose = require("mongoose");

require('dotenv').config();

exports.connect = () => {
    mongoose.connect( process.env.MONGODB_URL, {})
    .then( console.log("DB connection successfully"))
    .catch( (error) => {
        console.log("Db Connection Issues");
        console.log(error);
        process.exit(1);
    });

} 