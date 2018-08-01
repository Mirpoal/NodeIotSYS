var sensorService = require('../services/sensor.service');
var powerService = require('../services/power.service');

//数据个数  自定义
var JSONdata_temp = new Array(20);
var JSONdata_humi = new Array(20);
var JSONdata_pm = new Array(20);
var JSONdata_power = new Array(12);


function getDaysInMonth(year,month){
    month = parseInt(month,10);
    var temp = new Date(year,month,0);
    return temp.getDate();
}

exports.httpmap = function (body,mac,sensor,callback) {
    switch(body.sensorname) {
        case 'DHT11':
            sensorService.getsensordata({mac:mac},function (err, sensor) {
                if(err) {
                    return callback('database err');
                }else{
                    if(sensor != null) {
                        if(sensor.hasOwnProperty('JSONdata')) {
                            var temp = JSON.parse(sensor.JSONdata).temp.split(',');
                            var humi = JSON.parse(sensor.JSONdata).humidity.split(',');
                            for(var i = 0;i<temp.length;i++) {
                                temp[i] = temp[i+1];
                                if(i === (temp.length-1)) {
                                    temp[i] = body.JSONdata.temp;
                                }
                            }
                            for(i = 0;i<humi.length;i++) {
                                humi[i] = humi[i+1];
                                if(i === (humi.length-1)) {
                                    humi[i] = body.JSONdata.Humidity;
                                }
                            }
                            callback(null,'{"temp":"'+temp+'","humidity":"'+ humi+'"}');
                        }else{
                            JSONdata_temp[JSONdata_temp.length-1] = body.JSONdata.temp;
                            JSONdata_humi[JSONdata_humi.length-1] = body.JSONdata.Humidity;
                            callback(null,'{"temp":"'+JSONdata_temp+'","humidity":"'+JSONdata_humi+'"}');
                        }
                    }
                }
            });
            break;

        case 'PM2.5' :
            sensorService.getsensordata({mac:mac},function (err, sensor) {
                if(err) {
                    return callback('database err');
                }else{
                    if(sensor != null) {
                        if(sensor.hasOwnProperty('JSONdata')) {
                            var pm = JSON.parse(sensor.JSONdata).pm.split(',');
                            for(var i = 0;i<pm.length;i++) {
                                pm[i] = pm[i+1];
                                if(i === (pm.length-1)) {
                                    pm[i] = body.JSONdata.pm;
                                }
                            }
                            callback(null,'{"pm":"'+pm+'"}');
                        }else{
                            JSONdata_pm[JSONdata_pm.length-1] = body.JSONdata.pm;
                            callback(null,'{"pm":"'+JSONdata_pm+'"}');
                        }
                    }
                }
            });
            break;

        case 'power' :
            sensorService.getsensordata({mac:mac},function (err, sensor) {
                if(err) {
                    return callback('database err');
                }else{
                    powerService.getpower(function (err, powerinfo) {
                        if(err) {
                            return callback('database err');
                        }
                        var now = new Date();
                        if(now.getDate() != 1) {
                            if(powerinfo[0] != null) {
                                if (sensor != null) {
                                    if (sensor.hasOwnProperty('JSONdata') && (sensor.JSONdata != null)) {
                                        var power = JSON.parse(sensor.JSONdata).power.split(',');
                                        var totalpower = powerinfo[0].total + body.JSONdata.power;
                                        powerService.updatepower({month:now.getMonth(),now:body.JSONdata.power,total:totalpower},function (err) {
                                            if(err) callback('database err');
                                        });
                                        power[now.getMonth()] = totalpower;
                                        callback(null, '{"power":"' + power + '"}');
                                    }else{
                                        JSONdata_power[now.getMonth()] = powerinfo[0].total;
                                        callback(null, '{"power":"' + JSONdata_power + '"}');
                                    }
                                }
                            }else {
                                powerService.save({month:now.getMonth(),now:body.JSONdata.power,total:0},function (err) {
                                    if(err) callback('database err');
                                });
                            }
                        }else{
                            if(powerinfo[0] != null) {
                                if(now.getMinutes()<1 && (now.getHours()==0)) {
                                    powerService.getpower(function (err) {
                                        if (err) {
                                            return callback('database err');
                                        }
                                        if (sensor.hasOwnProperty('JSONdata')) {
                                            var power = JSON.parse(sensor.JSONdata).power.split(',');
                                            power[now.getMonth()] = 0;
                                            powerService.updatepower({month:now.getMonth(),now:0,total:0},function (err) {
                                                if(err) callback('database err');
                                            });
                                            callback(null, '{"power":"' + power + '"}');
                                        }
                                    });
                                }else{
                                    sensorService.getsensordata({mac:mac},function (err, sensor) {
                                        if (err) {
                                            return callback('database err');
                                        }
                                        powerService.getpower(function (err, powerinfo) {
                                            if (err) {
                                                return callback('database err');
                                            }
                                            if (sensor != null) {
                                                if (sensor.hasOwnProperty('JSONdata') && (sensor.JSONdata != null)) {
                                                    var power = JSON.parse(sensor.JSONdata).power.split(',');
                                                    var totalpower = powerinfo[0].total + body.JSONdata.power;
                                                    powerService.updatepower({month:now.getMonth(),now:body.JSONdata.power,total:totalpower},function (err) {
                                                        if(err) callback('database err');
                                                    });
                                                    power[now.getMonth()] = totalpower;
                                                    callback(null, '{"power":"' + power + '"}');
                                                }else{
                                                    JSONdata_power[now.getMonth()] = powerinfo[0].total;
                                                    callback(null, '{"power":"' + JSONdata_power + '"}');
                                                }
                                            }
                                        });
                                    });
                                }
                            }else {
                                powerService.save({month:now.getMonth(),now:body.JSONdata.power,total:0},function (err) {
                                    if(err) callback('database err');
                                });
                            }
                        }
                    });
                }
            });
            break;
    }
};
