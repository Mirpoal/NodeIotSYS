var bl = require('bl');
var controllerService = require('./services/controller.service');
var deviceService = require('./services/device.service');
var macService = require('./services/mac.service');

var currentstate = false;
var currentcmd = 'off';
var currentmac = '';
var currentImap = 0;

exports.coapserver = function (server) {
    server.on('request', function(req, res) {
        req.pipe(bl(function(err, data) {
            if(err) console.log(err);
            try {
                var requestPayload = JSON.parse(data);
                var esp_mac = (requestPayload.mac).split(',');
                var mac = "";
                for(var i =0;i<6;i++) {
                    if(i===5) {
                        mac += (parseInt(esp_mac[i]).toString(16)).toString()
                    }else{
                        mac += (parseInt(esp_mac[i]).toString(16)).toString() + ":";
                    }
                }
            }catch (e) {
                res.code = '405';
                return res.end();
            }

            var macrecv = {
                mac:mac,
                sensorname:req.url.split('/')[1],
                auth:"控制设备，无需认证"
            };
            currentmac = mac;

            macService.one({mac:macrecv.mac},function (err, macinfo) {
                if(macinfo) {
                    var payload = {
                        url:req.url.split('/')[1],
                        mac:mac,
                        time:new Date(),
                        state:currentstate
                    };
                    deviceService.all(function (err, devinfo){
                        if(err) {
                            res.code = 500;
                            return res.end();
                        }
                        for(var index in devinfo) {
                            if (devinfo[index].mac === mac) {
                                controllerService.one({mac:mac},function (err,controller) {
                                    if(err) {
                                        res.code = 500;
                                        return res.end();
                                    }
                                    if(controller) {
                                        controllerService.update(payload,function (err) {
                                            if(err) {
                                                res.code = 500;
                                                return res.end();
                                            }
                                            macrecv.match = true;
                                            macService.update(macrecv,function (err) {
                                                if(err) {
                                                    res.code = 500;
                                                    return res.end();
                                                }
                                            });
                                        });
                                    }else{
                                        controllerService.save(payload,function (err) {
                                            if(err) {
                                                res.code = 500;
                                                return res.end();
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }else{
                    macService.save(macrecv,function (err) {
                        if(err) {
                            res.code = 500;
                            return res.end();
                        }
                    });
                }
            });

            var responsePayload = {};
            if(currentImap == 0) {
                responsePayload = {
                    state:currentstate,
                    mac:requestPayload.mac
                };
            }else {
                responsePayload = {
                    state:currentstate,
                    imap:currentImap,
                    mac:requestPayload.mac
                };
                currentImap = 0;
                console.log(responsePayload);
            }
            res.end(JSON.stringify(responsePayload));
        }));
    });
};

var save = function (req, res) {
    currentcmd = req.body.state;

    if(req.body.Imap != undefined) {
        currentImap = req.body.Imap;
    }
    if(currentcmd == "on") {
        if(currentmac == req.body.mac) {
            currentstate = true;
            res.status(202).send({state:"on"});
        }

    }else{
        if(currentcmd == "off") {
            if(currentmac == req.body.mac) {
                currentstate = false;
                res.status(202).send({state:"off"});
            }
        }
    }
};

var all = function (req, res) {
    controllerService.all(function (err, controller) {
        if(err) return res.status(500).end();
        res.status(200).json(controller);
    });
};

exports.save = save;

exports.all = all;
