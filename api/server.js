const http = require('http');
const api = require('./api');
require('dotenv').config();
const port = process.env.PORT || 5000;
const server = http.createServer(api);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind);
            process.exit(1);
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log(`Rest API listening on ${bind}.`);
}