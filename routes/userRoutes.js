const UserController = require('../controller/usersController');

module.exports = (app, upload) => {
    app.get('/api/users/getAll', UserController.getAll);
   // app.post('/api/users/createUser', UserController.createUser);
    app.post('/api/users/createUser',upload.array('image', 1), UserController.createUserWithImage);
    app.post('/api/users/login', UserController.login);
}