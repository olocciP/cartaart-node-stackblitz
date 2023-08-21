require('dotenv').config();

const HTTP = require('http');
const URL = require('url');

const port = process.argv[2] || process.env.PORT;
const start = (route, handle) => {
	HTTP.createServer((req, res) => {
		const pathname = URL.parse(req.url).pathname;
		route(handle, pathname, res, req);
	}).listen(parseInt(port, 10));
};

exports.start = start;