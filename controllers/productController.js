const Product = require('../models/Product');
const multer = require('multer');
const mongoose = require('mongoose');
// Add post
// exports.addProduct = async (req, res) => {
//   const newProduct = new Post(req.body);

//   try {
//     const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

exports.createProduct = (req, res, next) => {
  // console.log(req.file);
  const url = req.protocol + '://' + req.get('host');
  const product = new Product({
    title: req.body.title,
    desc: req.body.desc,
    image: url + '/' + req.file.path,
    price: req.body.price,
    quantaty: req.body.quantaty,
    category: req.body.category,
  });
  product
    .save()
    .then((product) => {
      res.status(200).json({ product });
      // console.log(product);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
// // Read one Product
exports.getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.searchProduct = async (req, res) => {
  console.log(req.params.key);
  let data = await Product.find({
    $or: [
      { title: { $regex: req.params.key } },
      { description: { $regex: req.params.key } },
    ],
  });
  res.send(data);
};

//update Product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

// // read all Product
exports.readAll = async (req, res) => {
  try {
    const product = await Product.find({});
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};
// // delete Product

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};
