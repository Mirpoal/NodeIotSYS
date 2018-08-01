var express = require('express');
var path = require('path');
var _ = require('lodash');
var ejs= require('ejs');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var router = require('./lib/route-map.lib');
var session = require('./lib/session.lib');
var validator = require('./lib/validator.lib');

var app = express();

// view engine setup
app.set('views',__dirname+'/public/views/admin');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/smartcloud.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(session.check(), session.init());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 转给 Router 处理路由
 */
app.use(router);

module.exports = app;
