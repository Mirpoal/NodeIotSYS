var async = require('async');
var systips = require('../systemTips/tips');
var deviceModel = require('../models/device.model');
var sensorModel = require('../models/sensor.model');

exports.all = function (callback) {
    sensorModel.find({})
        .exec(function (err, sensor) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,sensor);
        });
};

exports.getmac = function (options, callback) {
    sensorModel.find(options)
        .select('mac')
        .exec(function (err, sensor) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,sensor);
        });
};

exports.one = function (options, callback) {
    sensorModel.find(options)
        .select('mac pwd link state tips sensorname time ')
        .exec(function (err, sensor) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,sensor);
        });
};

exports.uptips = function (options, callback) {
    sensorModel.update({sensorname:options.sensorname},{$set:{tips:options.tips}},function (err, sensor) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, sensor);
    });
};

exports.sensoruptime = function (options, callback) {
    sensorModel.update({mac:options.mac},{$set:{time:options.time}},function (err, sensor) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, sensor);
    });
};

exports.sensorupdate = function (options, callback) {
    if(options.realdata) {
        sensorModel.update({mac:options.mac},{$set:{realdata:options.realdata}},function (err, sensor) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null, sensor);
        });
    }else {
        sensorModel.update({mac:options.mac},{$set:{JSONdata:options.JSONdata}},function (err, sensor) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null, sensor);
        });
    }
};

exports.getsensordata = function (options,callback) {
    sensorModel.findOne(options)
        .lean()
        .exec(function (err, sensor) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null, sensor);
        });
};

exports.getrealdata = function (options, callback) {
    sensorModel.find(options)
        .select('mac realdata')
        .lean()
        .exec(function (err, sensor) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,sensor);
        });
};

exports.putsensordata = function (options,callback) {
    var tips =  null;

    sensorModel.find({mac:options.mac},function (err, sen) {
        if(sen) {
            sensorModel.remove({mac:options.mac},function (err) {
                if(err) {
                    err.type = 'database';
                    return callback(err);
                }
            });
        }
        new sensorModel({
            sensorname: options.sensorname,
            statue : options.statue,
            JSONdata : options.JSONdata,
            tips : tips,
            controlled : options.controlled,
            sensor:options.sensor,
            pwd:options.pwd,
            mac:options.mac,
            link:options.link,
            agree:options.agree,
            time:new Date()
        }).save(function (err, sensor) {
            if(err) {
                err.type = 'database';
                console.log(err);
                return callback(err);
            }
            deviceModel.update({mac:options.matchmac},{match:sensor._id},function (err, device) {
                if (err) {
                    err.type = 'database';
                    return callback(err);
                }
                callback(null, device);
            });
            callback(null,sensor);
        });
    })
};