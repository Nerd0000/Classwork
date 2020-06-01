const express = require('express');

const gitController = require('./controllers/git.js');
const userController = require('./controllers/user.js');
const actionController = require('./controllers/actions.js');
const classController = require('./controllers/classes.js');
const routes = express.Router();


//User
routes.post('/user/create', userController.create);
routes.post('/user/update', userController.update);
routes.post('/user/updateCredentials', userController.updateCredentials);
routes.post('/user/updateRepos', userController.updateRepos);
routes.post('/user/classes/add', userController.addClass);
routes.post('/login', userController.login);
routes.delete('/user/delete', userController.delete);
routes.get('/users', userController.list);

//Class
routes.post('/class/create', classController.create);
routes.post('/class/update', classController.update);
routes.post('/class/members/add', classController.addMembers);
routes.delete('/class/delete', classController.delete);
routes.get('/class/members', classController.getMembers);
routes.get('/classes', classController.list);

//Actions 
routes.post('/action/create', actionController.create);
routes.post('/action/update', actionController.update);
routes.delete('/action/delete', actionController.delete);
routes.get('/actions', actionController.list);
routes.get('/actions/isValidId', actionController.isValidId);
routes.get('/raw', actionController.raw);

//Git
routes.get('/git', gitController.git);
routes.get('/git/user/repos', gitController.gitRepos);
module.exports = routes;