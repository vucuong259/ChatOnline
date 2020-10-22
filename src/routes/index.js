import express from 'express';
import { home, auth } from './../controllers';
import { authValid } from './../validation';
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';
// Init all passport
initPassportLocal();
let router = express.Router();
/* 
  Init all routes
  param @app from exactly module
*/
let initRoutes = (app) => {

    router.get('/login-register', auth.checkLoggedOut, auth.getLoginRegister);
    router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister);
    router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);
    router.post('/login', auth.checkLoggedOut, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login-register',
        successFlash: true,
        failureFlash: true
    }));

    router.get('/', auth.checkLoggedIn, home.getHome);
    router.get('/logout', auth.checkLoggedIn, auth.getLogOut);
    return app.use('/', router);
};
module.exports = initRoutes;