var async = require('async');
var deviceModel = require('../models/device.model');

exports.one = function (options,callback) {
    deviceModel.findOne(options)
        .lean()
        .exec(function (err, sensor) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null, sensor);
        });
};

exports.all = function (callback) {
    deviceModel.find({})
        .select('mac auth description match')
        .exec(function (err, devinfo) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,devinfo);
        });
};

/**
* 设备存储
 */
exports.save = function (options, callback) {
    if(!options.mac || !options.auth) {
        var err = {
            type: 'system',
            error: '设备必要信息没有传入'
        };
        callback(err);
    }
    new deviceModel({
        mac:options.mac,
        auth:options.auth,
        description:options.description,
        match : null
    }).save(function (err, device) {
        if(err) {
            err.type = 'database';
            console.log(err);
            return callback(err);
        }
        callback(null,device);
    });
};


/**
 * 删除设备
 */
exports.remove = function (options, callback) {
    if (!options._id) {
        var err = {
            type: 'system',
            error: '没有 id 传入'
        };
        return callback(err);
    }
    var _id = options._id;
    deviceModel.findByIdAndRemove(_id,function (err, device) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        if (!device) return callback();
        callback(null, device);
    });
};

/**
 * 更新设备
 */
exports.update = function (options, callback) {
    if (!options.auth) {
        var err = {
            type: 'system',
            error: '必要信息没有传入'
        };
        return callback(err);
    }
    sensorModel.update({mac:options.mac},{$set:{auth:options.auth,description:options.description}},function (err, device) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        if (!device) return callback();
        callback(null, device);
    });
};