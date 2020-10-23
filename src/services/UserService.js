import UserModel from './../models/userModel';

/* 
Update userInfo
*@param {userId} id
*@param {data update} item
*/
class UserService {
    updateUser(id, item) {
        return UserModel.updateUser(id, item);
    }
}
module.exports = new UserService