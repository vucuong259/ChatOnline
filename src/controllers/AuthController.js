import { validationResult } from 'express-validator';
import { auth } from './../services/index';
import { transSuccess } from './../../lang/vi';
class AuthController {
    getLoginRegister(req, res) {
        return res.render('auth/master', {
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    }
    async postRegister(req, res) {
        let errorArr = [];
        let successArr = [];
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            let errors = Object.values(validationErrors.mapped());
            errors.forEach(item => {
                errorArr.push(item.msg);
            });
            req.flash('errors', errorArr);
            return res.redirect('/login-register');
        }
        try {
            let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get('host'));
            successArr.push(createUserSuccess);
            req.flash('success', successArr);
            return res.redirect('/login-register');
        } catch (error) {
            errorArr.push(error);
            req.flash('errors', errorArr);
            return res.redirect('/login-register');
        }

    }
    async verifyAccount(req, res) {
        let errorArr = [];
        let successArr = [];
        try {
            let verifySuccess = await auth.verifyAccount(req.params.token);
            successArr.push(verifySuccess);
            req.flash('success', successArr);
            return res.redirect('/login-register');
        } catch (error) {
            errorArr.push(error);
            req.flash('errors', errorArr);
            return res.redirect('/login-register');
        }
    }
    getLogOut(req, res) {
        req.logout();
        req.flash('success', transSuccess.logout_success);
        return res.redirect('/login-register');
    }
    checkLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.redirect('/login-register');
        }
        next();
    }
    checkLoggedOut(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        next();
    }
}
module.exports = new AuthController;