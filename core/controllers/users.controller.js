var usersService = require('../services/users.service');

module.exports = {
  get: function (req, res) {
    req.checkQuery({
      'email': {
        optional: true,
        isEmail: { errorMessage: 'email 格式不正确' }
      }
    });

    if (req.validationErrors()) {
      return res.status(400).end();
    }

    var query = {};

    if (req.query.email) query.email = req.query.email;

    usersService.one(query, function (err, user) {
      if (err) {
        return res.status(500).end();
      }
      res.status(200).json(user);
    });
  }
};