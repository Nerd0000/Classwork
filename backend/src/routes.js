const express = require('express');

const gitController = require('./controllers/git.js');
const userController = require('./controllers/user.js');

const routes = express.Router();


//User
routes.post('/user/create', userController.create);
routes.post('/user/update', userController.update);
routes.post('/user/updateCredentials', userController.updateCredentials);
routes.post('/user/updateRepos', userController.updateRepos);
routes.post('/login', userController.login);
routes.delete('/user/delete', userController.delete);
routes.get('/users', userController.list);



//Git
routes.get('/git', gitController.git);
routes.get('/git/user/repos', gitController.gitRepos);
module.exports = routes;