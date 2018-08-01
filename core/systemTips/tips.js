var sensorService = require('../services/sensor.service');
/*
    根据传感器捕捉到的值系统建议
 */
exports.temprature = function (value,callback) {
    var tips = null;
    if(10 < value < 20) {
        tips = '当前温度凉爽';
    }else{
        if(20 < value < 30) {
            tips = '当前温度稍高，可把门窗打开降低室内温度';
        }else{
            tips = '建议打开空调，快速降温'
        }
    }
    callback(tips);
};

exports.pm = function (value, callback) {
    var tips = null;
    if(0.03 < value < 0.25) {
        tips = '室内空气良好';
    }else{
        if(0.25 < value < 0.40) {
            tips = '室内空气一般';
        }else{
            tips = '室内空气非常差'
        }
    }
    sensorService.uptips({sensorname:"PM2.5",tips:tips},function (err, sensor) {
        if(err) {
            err.typr = 'database err';
            callback(err);
        }
        callback(null,sensor);
    })
};