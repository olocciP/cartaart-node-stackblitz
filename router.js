const FS = require('fs');
const PATH = require('path');

const route = v => {
  const { handle, path, req, res } = v;

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
		handle[path]({ req: req, res: res, path: path });

	} else {
		const staticPath = /*/ 정적파일 위치를 나타낸다 /*/ __dirname + '/www'; 
		const extension =  /*/ 확장자를 나타낸다 /*/ PATH.extname(path);

		if (staticMap[extension]) {
			/*/ Static files in www을 나타낸다 /*/
			FS.readFile(staticPath + path, (err, data) => {
				res.writeHead(200, { 'Content-Type': staticMap[extension] });
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