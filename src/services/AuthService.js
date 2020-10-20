import UserModel from './../models/UserModel';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { transError, transSuccess } from './../../lang/vi';
let saltRounds = 7;

class AuthService {
    register(email, gender, password) {
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
            resolve(transSuccess.userCreated(user.local.email));
        });

    };

};
module.exports = new AuthService