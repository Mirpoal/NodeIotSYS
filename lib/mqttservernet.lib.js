var net = require('net');
var mqttcon = require('mqtt-connection');
var netServer = new net.Server();
var mqttserver = require('../core/mqttserver_net');

exports.startMQTTserver = function (){
    netServer.on('connection',function (stream) {
        var client = mqttcon(stream);
        mqttserver(client,stream);
    });
    netServer.listen(1883,function (err) {
        if(err) console.log('port 1884 is busy');
        console.log("mqtt server listen on port 1883")
    });
};