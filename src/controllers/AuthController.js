class AuthController {
    getLoginRegister(req, res) {
        return res.render('auth/master');
    }
}
module.exports = new AuthController;