class HomeController {
    getHome(req, res) {
        return res.render('main/home/home');
    }
}
module.exports = new HomeController;