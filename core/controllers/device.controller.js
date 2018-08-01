var deviceService = require('../services/device.service');

exports.all = function (req, res) {
    deviceService.all(function (err,devinfo) {
        if(err) return res.status(500).end();
        res.status(200).json(devinfo);
    });
};


exports.save = function (req, res) {
    var devinfo = {
        mac:req.body.mac,
        auth:req.body.auth,
        match:null,
        description:req.body.description
    };
    deviceService.save(devinfo,function (err) {
        if(err) return res.status(500).end();
        res.status(200).end();
    });
};


exports.remove = function (req, res) {
    req.checkParams({
        '_id': {
            notEmpty: {
                options: [true],
                errorMessage: '_id 不能为空'
            },
            isMongoId: { errorMessage: '_id 不能为空' }
        }
    });
    if (req.validationErrors()) {
        return res.status(400).end();
    }
    var _id = req.params._id;

    deviceService.remove({ _id: _id },function (err) {
        if (err) {
            return res.status(500).end();
        }
        res.status(204).end();
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
    if (req.validationErrors())
        return res.status(400).end();
    var _id = req.params._id;
    deviceService.one({_id:_id},function (err, device) {
        if (err)
            return res.status(500).end();
        res.status(200).json(device);
    });
};

exports.update = function (req, res) {

    var devinfo = {
        auth:req.body.auth,
        description:req.body.description
    };

    deviceService.update(devinfo,function (err) {
        if(err) return res.status(500).end();
        res.status(200).end();
    })
};