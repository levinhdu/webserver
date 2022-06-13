const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/student_management');
        console.log('connect successfully')
    } catch (error) {
        console.log('connect failure')      
    }
}

module.exports = {connect }