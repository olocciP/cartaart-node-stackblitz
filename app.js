const SERVER = require('./server');
const ROUTER = require('./router');
const HANDLERS = require('./requestHandlers');

const handle = {};
handle['/'] = HANDLERS.file;

handle['/tangram'] = HANDLERS.file;

// handle['/tangram'] = HANDLERS.file;
// handle['/rubberband'] = HANDLERS.file;
// handle['/lotto'] = HANDLERS.file;

// handle['/temp'] = HANDLERS.file;

SERVER.start({ route: ROUTER.route, handle: handle });