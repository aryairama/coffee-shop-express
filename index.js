/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import ioCookieParser from 'socket.io-cookie-parser';
import { responseError } from './src/helpers/helpers.js';
import CookieAuth from './src/middlewares/CookieAuth.js';
import categoriesRoute from './src/routes/categories.js';
import sizesRoute from './src/routes/sizes.js';
import deliveriesRoute from './src/routes/deliveries.js';
import usersRoute from './src/routes/users.js';
import productsRoute from './src/routes/products.js';

const app = express();
const port = process.env.PORT_APPLICATION;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: JSON.parse(process.env.CREDENTIALS),
    origin(origin, callback) {
      if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
});
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(
  cors({
    credentials: JSON.parse(process.env.CREDENTIALS),
    origin(origin, callback) {
      if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cookieParser());
app.use(express.json());
// Route
app.use('/categories', categoriesRoute);
app.use('/sizes', sizesRoute);
app.use('/deliveries', deliveriesRoute);
app.use('/users', usersRoute);
app.use('/products', productsRoute);

app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
io.use(ioCookieParser());
io.use(CookieAuth);
httpServer.listen(port, () => {
  console.log(`Server running port ${port}`);
});
