var mongoose = require('mongoose');

/**
 * 设备模型
 */
var deviceSchema = new mongoose.Schema({
    mac: {
        type : String,
        required: true,
        unique: true
    },

    auth: {
        type : String,
        required: true
    },

    match: {
        type : String,
        default: ""
    },


    description: String

}, {
    collection: 'devices',
    id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Devices', deviceSchema);