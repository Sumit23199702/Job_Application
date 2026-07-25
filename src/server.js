require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const dBConnection = require("./config/db");

const userRoute = require("./routes/userRoute");

const app = express();

// let middleware1 = (req, res, next) => {
//   console.log("Middleware 1");
//   // res.send("req. Ended");
//   next();
// };

// let middleware2 = (req, res, next) => {
//   // res.end("req. Ended");
//   next()
// };

// app.use(middleware1);
// app.use(middleware2)

app.use(express.json());
app.use("/users", userRoute);
dBConnection();

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is Running at Port ${PORT}`);
  }
});
