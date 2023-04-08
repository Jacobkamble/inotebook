const mongoose = require("mongoose");
const dotenv=require('dotenv')

dotenv.config({path:'./config.env'})

// const mongoURI = `mongodb://localhost:27017/notebook?directConnection=true&tls=false&readPreference=primary`;

// const mongoURI=`mongodb+srv://jacobkamble:Jacob1234@cluster0.1zytsba.mongodb.net/notebook`

// ?retryWrites=true&w=majority` 
const mongoURI = process.env.DB


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, options)
    .then((res) => {
      console.log("Connected to Db");
    })
    .catch((er) => console.log(er));
};

module.exports = connectToMongo;
