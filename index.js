const connectToMongo = require("./db");
const express = require("express");
const path=require('path');

const dotenv =require('dotenv');

dotenv.config({path:'./config.env'})

// connectToMongo();

const app = express();

const cors = require("cors");

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(cors());
app.use(express.json());

// Avaible routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));



const port =process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
});


// if(process.env.NODE_ENV==='production'){
//   app.use(express.static('client/bluid'));
//   const path=require('path');
//   app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//   })
// }

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

connectToMongo().then(() => {
  app.listen(port, () => {
      console.log("listening for requests",port);
  })
})
