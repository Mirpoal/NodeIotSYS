var coap        = require('coap')
    , server      = coap.createServer();
var coapserver = require('../core/coapserver');

exports.startCoAPserver = function () {
    coapserver.coapserver(server);
    server.listen(5683,function(err) {
        if(err) console.log('port 5683 is busy');
        console.log('coap server listen on port 5683');
    });
};