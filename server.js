//import express module
const express = require("express");
const cors = require("cors");
require('dotenv').config()

//use express in app variable
const app = express();

const router = require("./src/routes/router");

app.use(express.json());
app.use(cors());
app.use("/api/v1/", router);

//define the server port
const port = 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
