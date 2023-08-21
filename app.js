const SERVER = require('./server');
const ROUTER = require('./router');
const HANDLERS = require('./requestHandlers');

const handle = {};
handle['/'] = HANDLERS.file;
// handle['/laborans'] = HANDLERS.file;
// handle['/loquens'] = HANDLERS.file;
// handle['/ludens'] = HANDLERS.file;
// handle['/about'] = HANDLERS.file;

// handle['/evolution'] = HANDLERS.file;
// handle['/robot'] = HANDLERS.file;
// handle['/space'] = HANDLERS.file;

handle['/tangram'] = HANDLERS.file;
handle['/rubberband'] = HANDLERS.file;
handle['/lotto'] = HANDLERS.file;

handle['/temp'] = HANDLERS.file;

SERVER.start(ROUTER.route, handle);