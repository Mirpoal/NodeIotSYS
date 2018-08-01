var mongoose = require('mongoose');

/**
 * 子设备模型
 */
var sensorSchema = new mongoose.Schema({

    sensorname : {
        type: String,
        required: true
    },
    statue: {
        type: Boolean,
        default : false
    },

    JSONdata: String,

    realdata : String,

    tips : String,

    controlled : {
        type : Boolean,
        default : false,
        required: true
    },

    sensor : {
        type : Boolean,
        default : false,
        required: true
    },

    link: String,

    agree:String,

    mac: String,

    pwd: String,

    time : {
        type :Date,
        default : Date.now()
    }

}, {
    collection: 'sensor',
    id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Sensor', sensorSchema);