const mongoose = require('mongoose')

const lead = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
company:{
    type:String
},
status:{
    type:String,
    enum:['new','contacted','qualified','closed'],
    default:'new'
}

},{timestamps:true})

const leadModel = mongoose.model('lead',lead)
module.exports = leadModel