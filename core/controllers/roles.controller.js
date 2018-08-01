var _ = require('lodash');
var rolesService = require('../services/roles.service');

exports.list = function (req, res) {
  rolesService.all(function (err, roles) {
    if (err) {
      return res.status(500).end();
    }

    res.status(200).json(roles);
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

  if (req.validationErrors()) {
    return res.status(400).end();
  }

  var _id = req.params._id;

  rolesService.one({ _id: _id }, function (err, role) {
    if (err) {
      return res.status(500).end();
    }

    res.status(200).json(role);
  });
};

exports.create = function (req, res) {
  req.checkBody({
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为字符串' }
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为字符串' }
    },
    'authorities': {
      optional: true,
      inArray: {
        options: ['isNumber'],
        errorMessage: 'authorities 内需为数字'
      }
    }
  });

  if (req.validationErrors()) {
    return res.status(400).end();
  }

  var data = {
    name: req.body.name,
    description: req.body.description,
    authorities: req.body.authorities || []
  };

  rolesService.save({ data: data }, function (err, role) {
    if (err) {
      return res.status(500).end();
    }

    res.status(200).json(role);
  });
};


exports.update = function (req, res) {
  req.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: {errorMessage: 'name 需为 mongoId'}
    }
  });
  req.checkBody({
    'name': {
      optional: true,
      isString: { errorMessage: 'name 需为字符串' }
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为字符串' }
    },
    'authorities': {
      optional: true,
      inArray: {
        options: ['isNumber'],
        errorMessage: 'authorities 内需为数字'
      }
    }
  });

  if (req.validationErrors()) {
    return res.status(400).end();
  }

  var _id = req.params._id;
  var data = {
    name: req.body.name,
    authorities: req.body.authorities
  };

  if (req.body.description) data.description = req.body.description;

  rolesService.save({ _id: _id, data: data }, function (err) {
    if (err) {
      return res.status(500).end();
    }

    res.status(204).end();
  });
};

exports.remove = function (req, res) {
  req.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: {errorMessage: 'name 需为 mongoId'}
    }
  });

  if (req.validationErrors()) {
    return res.status(400).end();
  }

  var _id = req.params._id;

  rolesService.remove({ _id: _id }, function (err) {
    if (err) {
      return res.status(500).end();
    }

    res.status(204).end();
  });
};