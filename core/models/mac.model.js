var mongoose = require('mongoose');

/**
 * MAC模型
 */
var macSchema = new mongoose.Schema({

    sensorname : String,

    mac: {
        type : String,
        required: true,
        unique: true
    },

    auth: String,

    match: {
        type : Boolean,
        default :false,
        required: true
    }


}, {
    collection: 'mac',
    id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Mac', macSchema);