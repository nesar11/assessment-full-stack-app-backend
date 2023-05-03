const express = require('express');
const post = require('../controllers/postController');
const user = require('../controllers/userController');
const postRoute = express.Router();
const fileUpload = require('../middleware/extractFile');

postRoute.route('/add').post(user.authMiddleware, post.addPost);
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/verifyToken');

postRoute.post('/addPost', fileUpload, post.createPost);
postRoute.get('/find/:id', post.getOnePost);
postRoute.put('/:id', post.updatePost);
postRoute.get('/', post.reallAll);
postRoute.delete('/:id', post.deletePost);
postRoute.get('/search/:key', post.searchPost);

module.exports = postRoute;
