const FS = require('fs');

module.exports = {
	file: v => {
		const { res, req, path } = v;

		v.p = path === '/' ? '/index' : path;
    console.log('file '+ v.p);
		FS.readFile(__dirname + `/www/${v.p}.html`, (err, data) => {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		});
	},

	require: v => {
		const { res, req, path } = v;

		v.p = path === '/' ? '/home' : path;
    console.log('require '+ v.p);
		res.writeHead(200, { 'Content-Type': 'text/html' });

		_a.data = require(`./www/work${v.p}`).html;
		res.end(_a.data);
	}
};