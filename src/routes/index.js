const employeeRouter = require('./employee');
const loginRouter = require('./login');


function route(app) {

    app.use('/employee', employeeRouter);
    app.use('/admin', loginRouter);


}
  
module.exports = route;