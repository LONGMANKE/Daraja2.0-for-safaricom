const express = require("express");

const app = express();
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app is running al localhost:${port}`);
  });
  
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());