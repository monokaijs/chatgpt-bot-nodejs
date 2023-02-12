const express = require('express');
const apiRouter = require('./api.router');

const mainRouter = express.Router();

mainRouter.use('/api', apiRouter);

module.exports = mainRouter;
