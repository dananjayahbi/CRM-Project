const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UnitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const Unit = mongoose.model('Unit', UnitSchema);

module.exports = Unit;