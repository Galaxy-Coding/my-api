var parseString = require('xml2js').parseString;
const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const settings = { method: 'Get' };
const cheerio = require('cheerio');
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 720
});

app.use(limiter);
app.use(cors());

//xml2js
app.get('/xml2js', (req, res) => {
	var URL = decodeURIComponent(req.query.URL);
	try {
		fetch(URL, settings)
			.then(res => res.text())
			.then(text => {
				parseString(text, function(err, result) {
					if (!result || !URL) {
						res.status(400).send({
							message: 'Bad Request'
						});
					} else {
						res.json(result);
					}
				});
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

//api info
app.get('/info', (req, res) => {
	try {
		res.json({
			uptime: 'https://stats.uptimerobot.com/D6QYvfBy7E',
			source: 'https://repl.it/@GalaxyCoding/my-api',
			author: 'galaxy-coding'
		});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});
app.get('/', (req, res) => {
	try {
		res.json({ endpoints: ['/xml2js', '/info'] });
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});
app.get('/mdn', (req, res) => {
	try {
		fetch('https://developer.mozilla.org/en-US/docs/Glossary/CSS', settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);
				const output = $('p')
					.first()
					.text();
				res.json({ summary: output });
				const list = [];
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

app.listen(4000, () => {});
