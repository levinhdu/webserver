const express = require('express');
const route = express.Router();

const userController = require('../app/controllers/UsersController');


route.get('/create', userController.create);
route.get('/log', userController.log);
route.get('/getData', userController.getData);
route.post('/store', userController.store);
route.get('/:id/edit', userController.edit);
route.put('/:id', userController.update);
route.delete('/:id', userController.delete);
route.get('/', userController.show);


module.exports = route;