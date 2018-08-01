var async = require('async');
var sensorService = require('../services/sensor.service');
var usersService = require('../services/users.service');
var macService = require('../services/mac.service');
var controllerService = require('../services/controller.service');
var extendService = require('../services/extend.service');
var sha1 = require('../services/sha1.service');

var extend = {};

Array.prototype.entry = function (value) {
    if(this.length == 0) {
        this[0] = value;
    }else{
        this[this.length+1] = value;
    }
    return this;
};


/**
 * 前台路由
 */
exports.login = function (req, res) {
    req.session.destroy(function(err) {
        if (err) {
            return res.status(500).end();
        }
        res.render('login',{
            logininfo:""
        });
    });
};

exports.dologin = function (req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var autoSignIn = req.body.autoSignIn;

    usersService.one({ email: email, selectPassword: true }, function (err, user) {
        if (err) {
            return res.status(500).end();
        }
        if (user && sha1(password) === user.password) {
            req.session.user = user._id;
            if (autoSignIn) req.session.cookie.maxAge = 60 * 1000 * 60 * 24 * 90;
            res.redirect('/dashboard');
        } else {
            res.render('login',{
                logininfo:"登录失败"
            });
        }
    });
};


exports.signOut = function (req, res) {
    req.session.destroy(function(err) {
        if (err) {
            return res.status(500).end();
        }
        res.render('login',{
            logininfo:""
        });
    });
};

exports.introduce = function (req, res) {
    usersService.one({ _id: req.session.user },function (err, user) {
        if (err) {
            return res.status(500).end();
        }
        res.render('introduce',{
            userinfo:user
        });
    });

};

exports.extend = function (req, res) {
    req.session.extend = {
        mac:req.body.mac,
        auth:req.body.auth,
        dataname:req.body.dataname,
        unit:req.body.unit
    };
    macService.one({mac:req.body.mac,auth:req.body.auth},function (err, mac) {
        if(err) {
            req.session.extend.statue = '500';
            res.redirect('/dashboard');
        }
        if(mac==null) {
            req.session.extend.statue = '203';
        }else{
            if(mac.match) {
                sensorService.getrealdata({mac:req.body.mac},function (err, real) {
                    if(err) {
                        req.session.extend.statue = "500";
                        res.redirect('/dashboard');
                    }
                    extendService.getnum(function (err, extendnum) {
                        if(err) {
                            req.session.extend.statue = "500";
                            res.redirect('/dashboard');
                        }
                        if(extendnum[0] != null) {
                            extendService.upnum({num:extendnum[0].num+1},function (err) {
                                if(err) {
                                    req.session.extend.statue = "500";
                                    res.redirect('/dashboard');
                                }
                            });
                        }else{
                            extendService.save({num:1},function (err) {
                                if(err) {
                                    req.session.extend.statue = "500";
                                    res.redirect('/dashboard');
                                }
                            })
                        }
                    });
                    req.session.extend.realdata = real.realdata;
                });
                req.session.extend.statue = "200";
            }else{
                req.session.extend.statue = '204';
            }
        }
        res.redirect('/dashboard');
    });
};

exports.layoutmain = function (req, res) {

    if(req.session.user) {
        if(req.session.extend) {
            extend = req.session.extend;
            req.session.extend = null;
        }

        async.parallel({
            readmac : function (callback) {
                var macList = [];
                macService.all(function (err, macinfo) {
                    if(err) {
                        err.type = 'database';
                        return callback(err);
                    }
                    for(var index in macinfo) {
                        if(macinfo[index].sensorname == 'DTH11' || macinfo[index].sensorname == 'PM2.5'|| macinfo[index].sensorname == 'power' || macinfo[index].sensorname == "undefined" ){
                            macList.entry(macinfo[index].mac);
                        }
                    }
                    callback(null,macList);
                });
            },
            readuser : function (callback) {
                usersService.one({ _id: req.session.user },callback);
            },
            dht11mac: function (callback) {
                sensorService.getmac({sensorname:"DHT11"},callback)
            },
            pmmac: function (callback) {
                sensorService.getmac({sensorname:"PM2.5"},callback);
            },
            powermac : function (callback) {
                sensorService.getmac({sensorname:"power"},callback);
            },
            readlight : function (callback) {
                controllerService.one({url:'light'},callback);
            },
            readcurtains : function (callback) {
                controllerService.one({url:'curtains'},callback);
            },
            readinfra : function (callback) {
                controllerService.one({url:'infra'},callback);
            }
        },function (err, results) {
            if (err) return res.status(500).end();
            var now = new Date();
            res.render('layout-main', {
                maclist:results.readmac,
                userinfo:results.readuser,
                dht11mac:results.dht11mac[0].mac,
                pmmac:results.pmmac[0].mac,
                powermac:results.powermac[0].mac,
                light:results.readlight,
                curtains:results.readcurtains,
                infra:results.readinfra,
                nowMonth:now.getMonth(),
                extendstatue: extend.statue,
                extendreal: extend.realdata,
                extenddataname:extend.dataname,
                extendunit:extend.unit
            });
        });
    }else{
        res.render('login',{
            logininfo:"长时间未响应，请重新登录！"
        });
    }
};