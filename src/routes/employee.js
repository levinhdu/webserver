const express = require('express');
const route = express.Router();

const employeeController = require('../app/controllers/EmployeeController');
const MiddlewareController = require('../app/controllers/MiddlewareController');



route.get('/create', employeeController.create);
route.get('/thongke', employeeController.thongke);
route.get('/home', employeeController.home);
route.get('/log', employeeController.log);
route.get('/log/:page', employeeController.log);
route.get('/late/', employeeController.employeeLate);
route.get('/late/:page', employeeController.employeeLate);
route.get('/fever', employeeController.employeeFever);
route.get('/getName', employeeController.getName);
route.get('/getData',MiddlewareController.changeActice, employeeController.getDataIn, employeeController.getDataOut);
route.post('/store', employeeController.store);
route.get('/:id/edit', employeeController.edit);
route.put('/:id', employeeController.update);
route.delete('/:id', employeeController.delete);
route.get('/', employeeController.show);


module.exports = route;