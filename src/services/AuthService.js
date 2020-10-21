import UserModel from './../models/UserModel';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { transError, transSuccess, transMail } from './../../lang/vi';
import sendMail from './../config/mailer';
let saltRounds = 7;

class AuthService {
    register(email, gender, password, protocol, host) {
        return new Promise(async(resolve, reject) => {
            let userByEmail = await UserModel.findByEmail(email);
            if (userByEmail) {
                if (userByEmail.deleteAt != null) {
                    return reject(transError.account_removed);
                }
                if (!userByEmail.local.isActive) {
                    return reject(transError.account_not_active);
                }
                return reject(transError.account_in_use);
            }
            let salt = bcrypt.genSaltSync(saltRounds);

            let userItem = {
                username: email.split('@')[0],
                gender: gender,
                local: {
                    email: email,
                    password: bcrypt.hashSync(password, salt),
                    verifyToken: uuidv4()
                }
            };
            let user = await UserModel.createNew(userItem);
            let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
                //send email
            sendMail(email, transMail.subject, transMail.template(linkVerify))
                .then(success => {
                    resolve(transSuccess.userCreated(user.local.email));
                })
                .catch(async(error) => {
                    // remove user
                    await UserModel.removeById(user._id);
                    console.log(error);
                    reject(transMail.send_failed);

                });

        });

    };
    verifyAccount(token) {
        return new Promise(async(resolve, reject) => {
            let userByToken = await UserModel.findByToken(token);
            if (!userByToken) {
                return reject(transError.token_undefined);
            }

            await UserModel.verify(token);
            resolve(transSuccess.account_actived);
        })
    }

};
module.exports = new AuthService