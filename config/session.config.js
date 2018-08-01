var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = {
  secret: 'noderIotSys',
  name: 'noderIotSid',
  cookie: {
    httpOnly: false
  },
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,                  //不每次都重新保存会话
  saveUninitialized: false        //不自动保存未初始化的会话
};