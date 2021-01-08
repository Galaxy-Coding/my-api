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

app.get('/xml2js', (req, res) => {
	const URL = decodeURIComponent(req.query.URL);
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
		res.json({
			endpoints: [
				'/xml2js?URL=',
				'/info',
				'/mdn?q=',
				'/mdn?q=',
				'/mdn-search?q='
			]
		});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

app.get('/mdn', (req, res) => {
	try {
		let list = [];
		const q = decodeURIComponent(req.query.q);
		fetch(`https://developer.mozilla.org/en-US/search?q=${q}`, settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);

				$('.result-url a').each(function(i, elem) {
					list[i] = 'https://developer.mozilla.org' + $(this).attr('href');
				});
				if (!list || list.length == 0 || !q || q === undefined) {
					res.status(400).send({
						message: 'Bad Request'
					});
				} else {
					fetch(list[0], settings)
						.then(res => res.text())
						.then(text => {
							const $ = cheerio.load(text);
							const output = $('p')
								.first()
								.text();
							res.json({ summary: output, link: list[0] });
						});
				}
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

app.get('/mdn-search', (req, res) => {
	try {
		let list = [];

		const q = decodeURIComponent(req.query.q);
		fetch(`https://developer.mozilla.org/en-US/search?q=${q}`, settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);
				$('.result-url a').each(function(i, elem) {
					list[i] = 'https://developer.mozilla.org' + $(this).attr('href');
				});
				if (!list || list.length == 0 || !q || q === undefined) {
					res.status(400).send({
						message: 'Bad Request'
					});
				} else {
					res.json(list);
				}
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

app.get('/js-info-search', (req, res) => {
	try {
		let list = [];
		const q = decodeURIComponent(req.query.q);
		fetch(`https://javascript.info/search/?query=${q}`, settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);
				$('.search-results__title > a ').each(function(i, elem) {
					list[i] = 'https://javascript.info' + $(this).attr('href');
				});

				if (!list) {
					res.status(400).send({
						message: 'Bad Request'
					});
				} else {
					res.json(list);
				}
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

app.get('/mdn-search', (req, res) => {
	try {
		let list = [];

		const q = decodeURIComponent(req.query.q);
		fetch(`https://developer.mozilla.org/en-US/search?q=${q}`, settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);
				$('.result-url a').each(function(i, elem) {
					list[i] = 'https://developer.mozilla.org' + $(this).attr('href');
				});
				if (!list || list.length == 0 || !q || q === undefined) {
					res.status(400).send({
						message: 'Bad Request'
					});
				} else {
					res.json(list);
				}
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

/*
app.get('/genius', (req, res) => {
	try {
		const q = decodeURIComponent(req.query.q);
		fetch(`https://genius.com/Trippie-redd-love-scars-lyrics`, settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);
				const result = $(".lyrics").text();
				console.log(result)
				if (!result ) {
					res.status(400).send({
						message: 'Bad Request'
					});
				} else {
					res.json({"lyrics":result});
				}
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});
*/
app.get('/iogames-space', (req, res) => {
	try {
		let list = [];

		const q = decodeURIComponent(req.query.q);
		fetch(`https://iogames.space/search/node/shooter`, settings)
			.then(res => res.text())
			.then(text => {
				const $ = cheerio.load(text);
				$('h3 > a').each(function(i, elem) {
				  console.log($(this).attr('href'))
					list[i] = {url : $(this).attr('href') , title: $(this).text()}
				});
				if (!list ) {
					res.status(400).send({
						message: 'Bad Request'
					});
				} else {
					res.json(list);
				}
			});
	} catch (err) {
		res.status(400).send({
			message: 'Bad Request'
		});
		console.log(err);
	}
});

app.listen(4000, () => {});
