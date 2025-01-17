const {Router} = require('express');
const { signUpUser, signInUser } = require('../controller/user');

const authRoutes = Router();
authRoutes.post('/signup', signUpUser);
authRoutes.post('/login', signInUser);

module.exports = authRoutes;