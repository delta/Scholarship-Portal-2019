const mongoose = require('mongoose');

const scholarshipSchema = mongoose.Schema({
  personalDetails : {
    type: Object,
    required : true
  },
  acads:{
    type: Object,
    required : true
  },
  documents:{
    type: Array,
    required : true
  },
  scholarshipStatus:{
    type:Number,
    required:true
  },
  uniqueID:{
    type:String,
    required:true
  }
})

module.exports = mongoose.model('scholarship', scholarshipSchema)
