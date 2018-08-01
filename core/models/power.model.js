var mongoose = require('mongoose');

/**
 * 角色模型
 */
var powerSchema = new mongoose.Schema({

    month:Number,

    now: Number,

    total: Number

}, {
    collection: 'power',
    id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Power', powerSchema);