var async = require('async');
var _ = require('lodash');
var usersModel = require('../models/users.model');

/**
 * 用户列表
 */
exports.list = function (options, callback) {
  var query = {};

  if (options.type) query.type = options.type;

  usersModel.find(query)
    .select('type nickname email role')
    .populate('role', 'name description authorities')
    .lean()
    .exec(function (err, users) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      callback(null, users);
    });
};

/**
 * 查询用户
 */
exports.one = function (options, callback) {
  var selectPassword = options.selectPassword || false;

  var query = {};

  if (options.email) query.email = options.email;
  if (options._id) query._id = options._id;

  usersModel.findOne(query)
    .select('nickname email password')
    .lean()
    .exec(function (err, user) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      if (!user) return callback();

      if (!selectPassword) {
        delete user.password;
      }

      callback(null, user);
    });
};


exports.save = function (options, callback) {
    if (!options.data) {
        var err = {
            type: 'system',
            error: '没有传入 data'
        };

        return callback(err);
    }

    var _id = options._id;
    var data = options.data;
    var userSelf = options.userSelf;

    if (_id) {
        usersModel.findById(_id)
            .populate('role')
            .exec(function (err, user) {
                if (err) {
                    err.type = 'database';
                    return callback(err);
                }

                var isSuAdmin =  _.find(_.get(user, 'role.authorities'), function (authory) {
                    return authory === 100000;
                });

                if (isSuAdmin && !userSelf) {
                    var err = {
                        type: 'system',
                        error: '权限错误'
                    };
                    return callback(err);
                }

                usersModel.update({ _id: _id }, data, { runValidators: true }, function (err) {
                    if (err) {
                        err.type = 'database';
                        return callback(err);
                    }

                    callback();
                });
            });
    } else {
        new usersModel(data).save(function (err, user) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }

            callback(null, user);
        });
    }
};


exports.remove = function (options, callback) {
    if (!options._id) {
        var err = {
            type: 'system',
            error: '没有传入 _id'
        };

        return callback(err);
    }

    var _id = options._id;

    usersModel.findById(_id)
        .populate('role')
        .exec(function (err, user) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }

            if (!user) return callback();

            var isSuAdmin =  _.find(_.get(user, 'role.authorities'), function (authory) {
                return authory === 100000;
            });

            if (isSuAdmin) {
                var err = {
                    type: 'system',
                    error: '不允许删除权限超级用户'
                };
                return callback(err);
            }

            user.remove(function (err) {
                if (err) err.type = 'database';

                callback(err);
            })
        });
};

