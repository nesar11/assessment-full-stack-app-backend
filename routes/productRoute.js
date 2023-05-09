const express = require('express');
const product = require('../controllers/productController');
const user = require('../controllers/userController');
const productRoute = express.Router();
const fileUpload = require('../middleware/extractFile');

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/verifyToken');

productRoute.post('/add', fileUpload, product.createProduct);
productRoute.get('/find/:id', product.getOneProduct);
productRoute.put('/:id', product.updateProduct);
productRoute.get('/', product.readAll);
productRoute.delete('/:id', product.deleteProduct);
productRoute.get('/search/:key', product.searchProduct);

module.exports = productRoute;
