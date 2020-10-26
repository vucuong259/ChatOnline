import multer from "multer";
import { app } from "./../config/app";
import { transError, transSuccess } from "./../../lang/vi";
import { v4 as uuidv4 } from "uuid";
import { user } from "./../services";
import fsExtra from "fs-extra";
import { validationResult } from "express-validator";
let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    let math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transError.avatar_type, null);
    }
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  },
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: { fileSize: app.avatar_limit_size },
}).single("avatar");

class UserController {
  updateAvatar(req, res) {
    avatarUploadFile(req, res, async (error) => {
      if (error) {
        if (error.message) {
          return res.status(500).send(transError.avatar_size);
        }
        return res.status(500).send(error);
      }
      try {
        let updateUserItem = {
          avatar: req.file.filename,
          updatedAt: Date.now(),
        };
        // Update user
        let userUpdate = await user.updateUser(req.user._id, updateUserItem);
        //remove old user avatar
        await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
        let result = {
          message: transSuccess.user_info_updated,
          imageSrc: `/images/users/${req.file.filename}`,
        };
        return res.status(200).send(result);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    });
  }
  async updateInfo(req, res) {
    let errorArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach((item) => {
        errorArr.push(item.msg);
      });
      return res.status(500).send(errorArr);
    }

    try {
      let updateUserItem = req.body;
      await user.updateUser(req.user._id, updateUserItem);
      let result = {
        message: transSuccess.user_info_updated,
      };
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  
  
  }
  async updatePassword(req, res){
    let errorArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach((item) => {
        errorArr.push(item.msg);
      });
      return res.status(500).send(errorArr);
    }
    try {
      let updateUserItem = req.body;
      await user.updatePassword(req.user._id, updateUserItem);
      let result = {
        message: transSuccess.user_password_updated
      };
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

module.exports = new UserController;
