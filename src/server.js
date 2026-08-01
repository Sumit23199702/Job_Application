require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const dBConnection = require("./config/db");

const userRoute = require("./routes/userRoute");
const jobRoute = require("./routes/jobRoute");

const app = express();

app.use(express.json());
app.use("/users", userRoute);
app.use("/jobs", jobRoute);
dBConnection();

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is Running at Port ${PORT}`);
  }
});
