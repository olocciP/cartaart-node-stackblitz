const FS = require('fs');

module.exports = {
	file: (_a) => {
		let { res, req, path } = _a;

		path = path === '/' ? '/main' : path;

		FS.readFile(__dirname + `/public/ctx${path}.html`, (err, data) => {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		});
	},

	require: (_a) => {
		let { res, req, path } = _a;
		path = path === '/' ? '/main' : path;
		res.writeHead(200, { 'Content-Type': 'text/html' });

		_a.data = require(`./public/ctx${path}`).html;
		res.end(_a.data);
	}
};