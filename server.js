const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const config = require('./config/DB');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const productRoute = require('./routes/productRoute');

require('dotenv').config();

const PORT = process.env.PORT || 8000;

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(config.DB).then(
  () => {
    console.log('Database is connected');
  },
  (err) => {
    console.log('Can not connect to the database' + err);
  }
);

const app = express();
// Create a write stream for the log file

function requestLogger(req, res, next) {
  const logStream = fs.createWriteStream('requests.log', { flags: 'a' });
  const timestamp = new Date().toISOString();
  const { method, url, headers } = req;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  logStream.write(
    `${timestamp} ${ipAddress} ${method} ${url} ${JSON.stringify(headers)}\n`
  );
  logStream.on('error', (err) => {
    console.error(`Error writing to request log: ${err.message}`);
  });
  logStream.end();

  next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST',
    'GET',
    'HEAD',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(morgan('dev'));
app.use(requestLogger);
app.use(cors(corsOptions));
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/products', productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
