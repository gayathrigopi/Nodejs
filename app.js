const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const productsRouts = require("./products");
const ordersRouts = require("./orders");

mongoose.connect(
  "mongodb+srv://gayathri:gayathri@cluster0.zdenk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useMongoClient: true,
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST,PATCH,DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRouts);
app.use("/orders", ordersRouts);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

/*app.use((req, res, next) => {
  res.status(200).json({
	message: "It works",
  });
});*/

module.exports = app;
