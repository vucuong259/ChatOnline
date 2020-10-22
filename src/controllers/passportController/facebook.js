import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/userModel";
import { transError, transSuccess } from "./../../../lang/vi";

let FacebookStratery = passportFacebook.Strategy;

let fbAppId = '351751859425206';
let fbAppSecret = 'e775a1252a6e4745a3d22296eb1edfde';
let fbCallbackUrl = 'https://localhost:2509/auth/facebook/callback';

/**
 * Valid user account type: Facebook
 */

let initPassportFacebook = () => {

    passport.use(new FacebookStratery({
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        callbackURL: fbCallbackUrl,
        passReqToCallback: true,
        profileFields: ['email', 'gender', 'displayName']
    }, async(req, accesssToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findByFacebookUid(profile.id);
            if (user) {
                return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
            }
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: { isActive: true },
                facebook: {
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

module.exports = initPassportFacebook;