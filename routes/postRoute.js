const express = require('express');
const post = require('../controllers/postController')
const user = require('../controllers/userController')
const postRoute = express.Router();



postRoute.route('/add').post( user.authMiddleware, post.addPost);
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
 } = require("../middleware/verifyToken");

postRoute.post("/addPost", verifyToken, post.addPost);
  

module.exports = postRoute