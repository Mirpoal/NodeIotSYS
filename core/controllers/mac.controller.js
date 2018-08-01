var macService = require('../services/mac.service');

exports.all = function (req, res) {
    macService.all(function (err, mac) {
        if(err) return res.status(500).end();
        res.status(200).json(mac);
    });
};
