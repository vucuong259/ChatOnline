import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/userModel";
import ChatGroupModel from "./../../models/chatGroupModel";
import { transError, transSuccess } from "./../../../lang/vi";

let LocalStratery = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

let initPassportLocal = () => {

    passport.use(new LocalStratery({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async(req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);
            if (!user) {
                return done(null, false, req.flash("errors", transError.login_failed));
            }
            if (!user.local.isActive) {
                return done(null, false, req.flash("errors", transError.account_not_active));
            }

            let checkPassword = await user.comparePassword(password);
            if (!checkPassword) {
                return done(null, false, req.flash("errors", transError.login_failed));
            }

            return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
        } catch (error) {
            // Server Error
            console.log(error);
            return done(null, false, req.flash("errors", transError.server_error));
        }
    }));

    /**
     * Save UserID to Session
     */
    passport.serializeUser((user, done) => {
        // only save user._id
        done(null, user._id);
    });
    // this is called by passport session()
    // return userInfo to req.user
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findUserByIdForSessionToUse(id);
            let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    });
};

module.exports = initPassportLocal;