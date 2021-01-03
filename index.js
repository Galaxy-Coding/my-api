var parseString = require('xml2js').parseString;
const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const settings = { method: 'Get' };

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 720
});

app.use(limiter);
app.use(cors());
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

app.listen(4000, () => {});
