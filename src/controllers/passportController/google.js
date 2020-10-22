import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "./../../models/userModel";
import { transError, transSuccess } from "./../../../lang/vi";

let GoogleStratery = passportGoogle.OAuth2Strategy;

let ggAppId = '965511690849-eek6ou9pt5jjn9ua6sg7j9rq5k1gd81q.apps.googleusercontent.com';
let ggAppSecret = '80E9e00i5ussdvK_pOlW2PHc';
let ggCallbackUrl = 'https://localhost:2509/auth/google/callback';

/**
 * Valid user account type: Google
 */

let initPassportGoogle = () => {

    passport.use(new GoogleStratery({
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true,
    }, async(req, accesssToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findByGoogleUid(profile.id);
            if (user) {
                return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
            }
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: { isActive: true },
                google: {
                    uid: profile.id,
                    token: accesssToken,
                    email: profile.emails[0].value
                }
            };
            let newUser = await UserModel.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.login_success(newUser.username)));

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
    passport.deserializeUser((id, done) => {
        UserModel.findUserById(id)
            .then(user => {
                return done(null, user);
            })
            .catch(error => {
                return done(error, null);
            });
    });
};

module.exports = initPassportGoogle;