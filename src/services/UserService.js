import UserModel from './../models/userModel';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {transError} from './../../lang/vi';
/* 
Update userInfo
*@param {userId} id
*@param {data update} item
*/

const saltRounds = 7;
class UserService {

    

    updateUser(id, item) {
        return UserModel.updateUser(id, item);
    }
/* 
Update userInfo
*@param {userId} id
*@param {data update} dataUpdate
*/
    updatePassword(id, dataUpdate){
        return new Promise(async (resolve, reject) =>{
            let currentUser = await UserModel.findUserById(id);
            if(!currentUser){
                return reject(transError.account_undefined);
            }
            let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
            if(!checkCurrentPassword){
                return reject(transError.user_current_password_failed);
            }
            let salt = bcrypt.genSaltSync(saltRounds);
            await UserModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt));
            resolve(true);
        });
    }
}
module.exports = new UserService