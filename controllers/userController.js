const User = require('../models/User');
const env = require('../config/DB');
const jwt = require('jsonwebtoken');

exports.register = function (req, res) {
  const { username, email, password, passwordConfirmation } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'Please provide email or password' });
  }

  if (password != passwordConfirmation) {
    return res.status(422).json({ error: 'Password does not match' });
  }
  User.findOne({ email }, function (err, existingUser) {
    if (err) {
      return res.status(422).json({ error: 'Oops! Something went Wrong' });
    }
    if (existingUser) {
      return res.status(422).json({ error: 'User already exists' });
    } else {
      const user = new User({
        username,
        email,
        password,
      });

      user.save(function (err) {
        if (err) {
          return res.status(422).json({
            error: 'Oops! Something went wrong',
          });
        }
        return res.status(200).json({ registered: true });
      });
    }
  });
};
exports.login = function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: 'Please provide email or password' });
  }
  User.findOne({ email }, function (err, user) {
    if (err) {
      return res.status(422).json({
        error: 'Oops! Something went wrong',
      });
    }

    if (!user) {
      return res.status(422).json({ error: 'Invalid user' });
    }

    if (user.hasSamePassword(password)) {
      // console.log(json_token);
      json_token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        env.secret,
        { expiresIn: '1h' }
      );
      console.log('token :', json_token);
      return res.json(json_token);
    } else {
      return res.status(422).json({ error: 'Wrong email or password' });
    }
  });
};

exports.newUser = async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.searchUser = async (req, res) => {
  console.log(req.params.key);
  let data = await User.find({
    $or: [
      { username: { $regex: req.params.key } },
      { email: { $regex: req.params.key } },
    ],
  });
  res.send(data);
};
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.readOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.allUser = async (req, res) => {
  try {
    const userData = await User.find({}).sort({ updatedAt: -1 });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.deleteOne = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json('User has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.authMiddleware = function (req, res, next) {
  const json_token = req.headers.authorization;
  try {
    if (json_token) {
      const user = parseToken(json_token);
      User.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).json({
            error: 'Oops! Something went wrong',
          });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return res.status(422).json({ error: 'Not authorized user' });
        }
      });
    } else {
      return res.status(422).json({ error: 'Not authorized user' });
    }
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err,
    });
  }
};

function parseToken(token) {
  return jwt.verify(token.split(' ')[1], env.secret);
}
