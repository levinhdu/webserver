const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema({
    admin: {type: String,maxlength: 255 },
    password: {type: String,maxlength: 255 },
  },
  {
    timestamps: true,
    collection: 'admin'
  }
); 


module.exports = mongoose.model('Admin', Admin)