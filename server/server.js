const Express    = require('express');
const path       = require('path');
const express    = Express();
const http       = require('http').createServer(express);
const storage    = path.join(__dirname, "..", 'store');
const port       = process.env.PORT || 3000;
const App        = require('./app');
const Store      = require('./store');
const args       = require('minimist')(process.argv.slice(2));
const debug      = !!args.debug;

/**
 * WebSocket Configuration
 */
const io = require('socket.io')(http, {});
/**
* DGG backend implementation.
*/
new App(io, new Store(), debug).bind();
/**
 * Static storage.
 */
express.use(Express.static(path.join(storage)));
/**
 * Http server.
 */
express.get('/', function (req, res) {
    res.sendFile(path.join(storage, 'index.html'));
});

express.get('/room/:id', function (req, res) {
    res.sendFile(path.join(storage, 'index.html'));
});

http.listen(port, () => console.log(`\x1b[32m`,
`
    [+] Server         : http://0.0.0.0:${port}
    [+] Storage Path   : ${storage}
    [+] Debug          : ${debug}

    [~] Running Server...

`,`\x1b[0m`));
