var mongoose = require('mongoose');

/**
 * 扩展模型
 */
var extendSchema = new mongoose.Schema({

    num: {
        type : Number,
        required: true,
        default : 0
    }

}, {
    collection: 'extend',
    id: false
});

/**
 * 发布为模型
 */
module.exports = mongoose.model('Extend', extendSchema);