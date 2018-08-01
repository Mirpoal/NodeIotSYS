var async = require('async');
var _ = require('lodash');
var sensorService = require('../services/sensor.service');
var deviceService = require('../services/device.service');
var sensormap = require('../map/sensor-map');
var macService = require('../services/mac.service');
var uptips = require('../systemTips/tips');

exports.all = function (req, res) {
    sensorService.all(function (err, sensorinfo) {
        if(err) return res.status(500).end();
        res.status(200).json(sensorinfo);
    });
};

exports.one = function (req, res) {
    req.checkParams({
        '_id': {
            notEmpty: {
                options: [true],
                errorMessage: '_id 不能为空'
            },
            isMongoId: { errorMessage: '_id 需为 mongoId' }
        }
    });
    if (req.validationErrors())
        return res.status(400).end();
    var _id = req.params._id;
    sensorService.one({_id:_id},function (err, sensor) {
        if (err)
            return res.status(500).end();
        res.status(200).json(sensor);
    });
};

exports.remove = function (req, res) {
    req.checkParams({
        '_id': {
            notEmpty: {
                options: [true],
                errorMessage: '_id 不能为空'
            },
            isMongoId: { errorMessage: '_id 不能为空' }
        }
    });
    if (req.validationErrors()) {
        return res.status(400).end();
    }
    var _id = req.params._id;

    sensorService.remove({ _id: _id },function (err) {
        if (err) {
            return res.status(500).end();
        }
        res.status(204).end();
    });
};

exports.getsensor = function (req,res) {

    var select = req.params._id;
    sensorService.getsensordata({mac:select},function (err, sensor) {
        if(err) {
            return res.status(500).end();
        }
        res.status(200).json(sensor);
    });
};

exports.getreal = function (req, res) {
    var select = req.params._id;
    sensorService.getrealdata({mac:select},function (err, sensor) {
        if(err) {
            return res.status(500).end();
        }
        res.status(200).json(sensor);
    });
};

exports.putsensor = function (req,res) {
    if(req.body) {
        var statue = true;
        var agree = "HTTP";
        var esp_mac = (req.body.mac).split(',');
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
            sensorname:req.body.sensorname,
            auth:req.body.pwd
        };
        var sensor = sensor = {
            statue: statue,
            sensorname: req.body.sensorname,
            realdata: null,
            controlled: req.body.controlled,
            sensor: req.body.sensor,
            link: req.body.link,
            mac: mac,
            pwd: req.body.pwd,
            now:new Date(),
            agree: agree
        };
        macService.one({mac:macrecv.mac},function (err, macinfo) {
            if (macinfo) {
                deviceService.all(function (err, devinfo){
                    if(err) return res.status(500).end();
                    for(var index in devinfo) {
                        if((devinfo[index].mac === mac)&&(devinfo[index].auth === req.body.pwd)) {
                            sensormap.httpmap(req.body,mac,sensor,function (err,JSONdata) {
                                if(err) res.status(500).end();
                                sensor.JSONdata = JSONdata;
                                sensorService.sensorupdate(sensor,function (err) {
                                    if(err) return res.status(500).end();
                                    res.status(200).end();
                                });
                            });
                            macrecv.match = true;
                            macService.update(macrecv,function (err) {
                                if(err) {
                                    res.code = 500;
                                    return res.end();
                                }
                                deviceService.one({mac:mac},function (err,flag) {
                                    if(err) return res.status(500).end();
                                    if(!flag.match) {
                                        sensor.matchmac = mac;
                                        sensorService.putsensordata(sensor,function (err) {
                                            if(err) return res.status(500).end();
                                            res.status(200).end();
                                        });
                                    }
                                });
                                uptips.pm(sensor.realdata,function (err) {
                                    if(err) return res.status(500).end();
                                });
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
    }
};