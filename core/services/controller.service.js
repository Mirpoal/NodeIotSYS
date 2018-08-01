var controllerModel = require('../models/controller.model');

exports.currentstate = function (options,callback) {
    controllerModel.findOne(options)
        .select("url state")
        .lean()
        .exec(function (err, control) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null, control);
        });
};

exports.save = function (options, callback) {
    new controllerModel({
        url : options.url,
        mac : options.mac,
        time : options.now,
        state : options.state
    }).save(function (err, controller) {
        if(err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, controller);
    });
};

exports.update = function (options, callback) {
    if (!options.mac) {
        var err = {
            type: 'system',
            error: '必要信息没有传入'
        };
        return callback(err);
    }
    controllerModel.update({mac:options.mac},{$set:{state:options.state,time:options.time}},function (err, controller) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        if (!controller) return callback();
        callback(null, controller);
    });
};

exports.all = function (callback) {
    controllerModel.find({})
        .exec(function (err, controllerinfo) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,controllerinfo);
        });
};

exports.one = function (options, callback) {
    controllerModel.findOne(options,function (err, controller) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, controller);
    });
};