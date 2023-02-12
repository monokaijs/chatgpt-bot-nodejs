const express = require('express');
const apiRouter = express.Router();
const DbService = require('../services/db.service');

apiRouter.get('/messages', async (req, res) => {
  const uid = req.query.uid;
  const messages = await DbService.getUserMessages(uid);
  console.log(messages);
  res.json({
    ok: true,
  })
});

module.exports = apiRouter;
