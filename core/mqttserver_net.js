var sensorService = require('./services/sensor.service');
var deviceService = require('./services/device.service');
var macService = require('./services/mac.service');

module.exports = function (client,stream) {

    client.on('connect',function (packet) {
        console.log("CONNECT: client id: " + client.id);
        client.connack({ returnCode: 0 });
    });

    client.on('publish',function (packet) {
        var payload = JSON.parse((packet.payload).toString());
        var statue = true;
        var agree = "MQTT";
        var link = "WiFi";
        var esp_mac = (payload.mac).split(',');
        var mac = "";
        for(var i =0;i<6;i++) {
            if(i===5) {
                mac += (parseInt(esp_mac[i]).toString(16)).toString()
            }else{
                mac += (parseInt(esp_mac[i]).toString(16)).toString() + ":";
            }
        }

        var macrecv = {
            mac:mac,
            sensorname:payload.name,
            auth:payload.pwd
        };
        macService.one({mac:macrecv.mac},function (err, macinfo) {
            if (macinfo) {
                deviceService.all(function (err, devinfo){
                    if(err) console.log(err);
                    for(var index in devinfo) {
                        if((devinfo[index].mac === mac)&&(devinfo[index].auth === payload.pwd)) {
                            var sensor = {
                                statue:statue,
                                realdata:JSON.stringify(payload.realdata),
                                sensorname:payload.name,
                                link:link,
                                mac:mac,
                                pwd:payload.pwd,
                                agree:agree
                            };

                            macrecv.match = true;
                            macService.update(macrecv,function (err) {
                                if (err) {
                                    console.log(err);
                                    client.destroy();
                                }
                                deviceService.one({mac:mac},function (err,flag) {
                                    if(err) {
                                        console.log(err);
                                        client.destroy();
                                    }
                                    if(flag.match) {
                                        sensorService.sensorupdate(sensor,function (err) {
                                            if(err) {
                                                console.log(err);
                                                client.destroy();
                                            }
                                        });
                                        sensor.realdata = null;
                                    }else{
                                        sensor.matchmac = mac;
                                        sensorService.putsensordata(sensor,function (err) {
                                            if(err) {
                                                console.log(err);
                                                client.destroy();
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            }else{
                macService.save(macrecv,function (err) {
                    if(err) {
                        console.log(err);
                        client.destroy();
                    }
                });
            }
        });
    });

    client.on('subscribe',function (packet) {
        console.log(packet);
    });
    client.on('close', function () { client.destroy() });
    client.on('error', function () { client.destroy() });
    client.on('disconnect', function () { client.destroy() });
    stream.on('timeout', function () { client.destroy(); });
};