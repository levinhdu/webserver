const express = require('express');
const route = express.Router();

const loginController = require('../app/controllers/LoginController');



route.get('/login', loginController.view);
route.post('/show', loginController.login);
route.get('/edit', loginController.edit);
route.put('/:id', loginController.update);






module.exports = route;