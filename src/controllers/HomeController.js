class HomeController {
    getHome(req, res) {
        return res.render('main/home/home', {
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    }
}
module.exports = new HomeController;