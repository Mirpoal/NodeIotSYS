var powerModel = require('../models/power.model');

exports.save = function (options, callback) {
  new powerModel({
      month:options.month,
      now : options.now,
      total : options.total
  }).save(function (err, power) {
      if (err) {
          err.type = 'database';
          return callback(err);
      }
      callback(null, power);
  });
};

exports.getpower = function (callback) {
    powerModel.find({})
        .select('month now total')
        .lean()
        .exec(function (err, power) {
            if(err) {
                err.type = 'database';
                return callback(err);
            }
            callback(null,power);
        });
};

exports.updatepower = function (options,callback) {
    powerModel.update({},{$set:{month:options.month,now:options.now,total:options.total}},function (err, power) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }
        callback(null, power);
    });
};