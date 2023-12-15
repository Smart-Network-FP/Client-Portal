/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

const axios = require('axios');

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.post('/api/login', async (req, res) => {
  console.log('Body', req.body);
  console.log(`-----> ${process.env.PROFILE_SERVICE}/v1/auth/login`);
  const response = await axios.post(
    `http://${process.env.PROFILE_SERVICE}:9000/v1/auth/login`,
    req.body,
  );
  console.log('Body2', response.data);
  if (response) {
    res.send(response.data);
  } else {
    res.send({});
  }
  console.log('Body 3', response.data);
});

app.post('/api/signup', async (req, res) => {
  console.log('Body', req.body);
  console.log(`-----> ${process.env.PROFILE_SERVICE}/v1/auth/register`);
  const response = await axios.post(
    `http://${process.env.PROFILE_SERVICE}:9000/v1/auth/register`,
    req.body,
  );
  console.log('Body2', response.data);
  if (response) {
    res.send(response.data);
  } else {
    res.send({});
  }
  console.log('Body 3', response.data);
});

app.post('/api/expertsearch', async (req, res) => {
  console.log('Body', req.body);
  const { query, token } = req.body;
  console.log(`-----> ${process.env.PROFILE_SERVICE}/v1/experts/query`);
  const response = await axios.post(
    `http://${process.env.PROFILE_SERVICE}:9000/v1/experts/query`,
    query,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('Body2', response.data);
  if (response) {
    res.send(response.data);
  } else {
    res.send({});
  }
  console.log('Body 3', response.data);
});

app.post('/api/getExpertById', async (req, res) => {
  console.log('Body', req.body);
  const { expertId, token } = req.body;
  console.log(
    `-----> ${
      process.env.PROFILE_SERVICE
    }/v1/experts/profileById?expertId=${expertId}`,
  );
  const response = await axios.get(
    `http://${
      process.env.PROFILE_SERVICE
    }:9000/v1/experts/profileById?expertId=${expertId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('Body2', response.data);
  if (response) {
    res.send(response.data);
  } else {
    res.send({});
  }
  console.log('Body 3', response.data);
});

app.post('/api/prompt', async (req, res) => {
  console.log('Body', req.body);
  const { token, queryString } = req.body;
  console.log(`-----> ${process.env.PROFILE_SERVICE}/v1/gpt/prompt`);
  const response = await axios.post(
    `http://${process.env.PROFILE_SERVICE}:9000/v1/gpt/prompt`,
    {
      message: queryString,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('Body2', response.data);
  if (response) {
    res.send(response.data);
  } else {
    res.send({});
  }
  console.log('Body 3', response.data);
});

// Elastic Search Endpoints
// Search
app.post('/api/search', async (req, res) => {
  console.log('Body', req.body);
  const { query, token } = req.body;
  console.log(`-----> ${process.env.PROFILE_SERVICE}/v1/elastic-search/search`);
  const response = await axios.post(
    `http://${process.env.PROFILE_SERVICE}:9000/v1/elastic-search/search`,
    {
      query,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('Body2', response.data);
  if (response) {
    res.send(response.data);
  } else {
    res.send({});
  }
  console.log('Body 3', response.data);
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 9000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
