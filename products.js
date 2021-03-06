const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("./product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "This is POST request",
        createdProduct: product,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entry forum" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
  /*if (id === "special") {
    res.status(200).json({
      message: "Special id taken",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
    });
  }*/
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updatedOps = {};

  for (const ops of req.body) {
    updatedOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updatedOps })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  res.status(200).json({
    message: "Product Deleted",
  });
});

module.exports = router;
