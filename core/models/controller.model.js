
var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({

    url: {
        type : String,
        required : true
    },
    mac: {
        type : String,
        required: true,
        unique: true
    },

    time : {
        type :Date,
        default : Date.now()
    },

    state :  {
        type: Number,
        required: true,
    }

}, {
    collection: 'controller',
    id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Controller', deviceSchema);