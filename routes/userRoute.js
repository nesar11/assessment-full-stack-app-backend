const express = require('express');
const user = require('../controllers/userController');
const router = express.Router();

router.post('/register', user.register);
router.post('/newuser', user.authMiddleware, user.newUser);
router.get('/', user.authMiddleware, user.allUser);
router.delete('/:id', user.authMiddleware, user.deleteOne);
router.put('/update/:id', user.authMiddleware, user.updateUser);
router.get('/view/:id', user.authMiddleware, user.readOne);
router.post('/login', user.login);

module.exports = router;
