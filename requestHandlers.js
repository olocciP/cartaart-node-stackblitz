const FS = require('fs');

module.exports = {
	file: (_a) => {
		let { res, req, path } = _a;

		path = path === '/' ? '/index' : path;
    console.log(path);
		FS.readFile(__dirname + `/www/${path}.html`, (err, data) => {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		});
	},

	require: (_a) => {
		let { res, req, path } = _a;
		path = path === '/' ? '/home' : path;
		res.writeHead(200, { 'Content-Type': 'text/html' });

		_a.data = require(`./www/work${path}`).html;
		res.end(_a.data);
	}
};