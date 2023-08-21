const FS = require('fs');
const PATH = require('path');

const route = (handle, path, res, req) => {
	const staticMap = {
		'.ico': 'image/x-icon',
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.xml': 'text/xml',
		'.css': 'text/css',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.svg': 'image/svg+xml',
		'.mp3': 'audio/mpeg',
		'.mp4': 'video/mp4',
		'.css': 'text/css',
		'.ttf': 'font/ttf',
		'.glb': 'model/gltf-binary',
		'.gltf': 'model/gltf-binary'
	};

	if (typeof handle[path] === 'function') {
		// console.log(path);
		handle[path]({ res: res, req: req, path: path });
	} else {
		const staticPath = __dirname + '/public'; ///. 정적파일 위를 나타낸다
		const extension = PATH.extname(path); // 확장자를 나타낸다

		if (staticMap[extension]) {
			///. Static files in public을 나타낸다
			FS.readFile(staticPath + path, (err, data) => {
				// res.writeHead(200, { 'Content-Type': staticMap[extension] });
        res.writeHead(200, {
          'Content-Type': staticMap[extension],
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Request-Methods' : 'GET, POST, PUT, DELETE',
          'Access-Control-Max-Age' : '60',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Content-Length, API-Key, Accept'
        });
    
				res.end(data);
			});
		} else {
			FS.readFile('./views/404.html', (err, data) => {
				res.writeHead(404, { 'Content-Type': 'text/html' });
				res.end(data);
			});
		}
	}
};

exports.route = route;