const express = require('express');
const router = express.Router();
const apicache = require('apicache');
const Scraper = require('./services/Scraper');

const scraper = new Scraper();
const cache = apicache.middleware;

router.get('/cases', cache('1 hour'), async (req, res) => {
  const data = await scraper.fetchTimeSeries().catch((e) => { console.error(e) });
  return res.json(data);
});

router.get('/fatality-rate', cache('1 hour'), async (req, res) => {
  const data = await scraper.getFatalityRate().catch((e) => { console.error(e.message) });;
  return res.json(data);
});

module.exports = router;