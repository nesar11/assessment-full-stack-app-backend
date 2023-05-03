const Post = require('../models/Post');
const multer = require('multer');
const mongoose = require('mongoose');
// Add post
exports.addPost = async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createPost = (req, res, next) => {
  // console.log(req.file);
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    image: url + '/' + req.file.path,
  });
  post
    .save()
    .then((post) => {
      res.status(200).json({ post });
      // console.log(post);
    })
    .catch((err) => {
      res.status(400).send(' Unable to save the database');
    });
};
// Read one post
exports.getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.searchPost = async (req, res) => {
  console.log(req.params.key);
  let data = await Post.find({
    $or: [
      { title: { $regex: req.params.key } },
      { description: { $regex: req.params.key } },
    ],
  });
  res.send(data);
};

//update post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

// read all post
exports.reallAll = async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};
// delete post

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json('post has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};
