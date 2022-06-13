const userRouter = require('./users');
const loginRouter = require('./login');


function route(app) {

    app.use('/users', userRouter);
    app.use('/admin', loginRouter);


}
  
module.exports = route;