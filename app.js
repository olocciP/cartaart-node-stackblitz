const SERVER = require('./server');
const ROUTER = require('./router');
const HANDLERS = require('./requestHandlers');

const handle = {};

handle['/'] = HANDLERS.file;
handle['/member'] = HANDLERS.file;

SERVER.start({ route: ROUTER.route, handle: handle });