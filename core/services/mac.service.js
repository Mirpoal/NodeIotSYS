var macModel = require('../models/mac.model');

exports.one = function (options, callback) {
    macModel.findOne(options)
        .select('mac match')
        .lean()
        .exec(function (err, mac) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null, mac);
        });
};

exports.all = function (callback) {
    macModel.find({})
        .select("sensorname mac auth match")
        .lean()
        .exec(function (err, mac) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,mac);
        });
};

exports.save = function (options, callback) {
    if(!options.mac || (!options.sensorname && !options.url)) {
        var err = {
            type: 'system',
            error: '设备必要信息没有传入'
        };
        callback(err);
    }
    new macModel({
        sensorname : options.sensorname || options.url,
        mac : options.mac,
        auth : options.auth,
        match : false
    }).save(function (err, mac) {
        if(err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null,mac);
    });
};


exports.update = function (options, callback) {
    macModel.update({mac:options.mac},{$set:{match:options.match}},function (err, mac) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        if (!mac) return callback();
        callback(null, mac);
    });
};