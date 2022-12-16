const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Employee = new Schema({
      id_nv: {type: String, maxlength: 255 },
      name: {type: String, maxlength: 255 },
      position: {type: String, maxlength: 255 },
      phone: {type: String, maxlength: 255 },
      active: {type: Boolean, default: true }
    },
    {
      timestamps: true,
    }
); 





module.exports = mongoose.model('Employee', Employee)