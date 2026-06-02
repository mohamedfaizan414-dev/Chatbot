const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lead',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const noteModel = mongoose.model('note', noteSchema)
module.exports = noteModel