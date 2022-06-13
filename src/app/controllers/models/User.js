const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
      mssv: {type: String,maxlength: 255 },
      name: {type: String,maxlength: 600 },
      class: {type: String, maxlength: 255 },
      temp: {type: String, maxlength: 255 },
      date: {type: String, maxlength: 255 },
      timein: {type: String, maxlength: 255 },
      Date: { type: Date, default: Date.now },
      condition: {type: Boolean},
    },
    {
      timestamps: true,
      collection: 'users'
    }
);   
const Admin = new Schema({
      admin: {type: String,maxlength: 255 },
      password: {type: String,maxlength: 255 },
    },
    {
      timestamps: true,
      collection: 'admin'
    }
); 

  module.exports = {User: mongoose.model('User', User),
  Admin: mongoose.model('Admin', Admin)
}