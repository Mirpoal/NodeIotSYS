var extendModel = require('../models/extend.model');

exports.getnum = function (callback) {
    extendModel.find({})
        .select('num')
        .exec(function (err, extend) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,extend);
        });
};


exports.upnum = function (options,callback) {
    extendModel.update({},{$set:options},function (err, extend) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, extend);
    });
};


exports.save = function (options, callback) {
    new extendModel({
        num : options.num
    }).save(function (err, extend) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, extend);
    });
};