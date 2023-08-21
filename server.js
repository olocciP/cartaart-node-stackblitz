require('dotenv').config(); /*/ Installation required > npm i dotenv /*/

const HTTP = require('http');
const URL = require('url');

const port = process.argv[2] || process.env.PORT;
const start = v => {
  const { route, handle } = v;

	HTTP.createServer((req, res) => {
		v.path = URL.parse(req.url).pathname;
    v.req = req;
    v.res = res;

		route(v);
	}).listen(parseInt(port, 10));
};

exports.start = start;