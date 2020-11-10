import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';

const LIMIT_NUMER_TAKEN = 1;
class NotificationService {
  /* 
    Get notifications when refresh f5 page
    string currentUserId
  */
  getNotifications(currentUserId){
    return new Promise(async (resolve, reject) => {
      try {
        let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMER_TAKEN);
        let getNotifContent = notifications.map(async (notification) => {
          let sender = await UserModel.findUserById(notification.senderId);
          return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
        });

        resolve(await Promise.all(getNotifContent));
      } catch (error) {
        reject(error);
      }
    })
  };
/* 
  Count all notification unread
*/
  countNotifUnread(currentUserId){
    return new Promise(async (resolve, reject) => {
      try {
        let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
        resolve(notificationsUnread);
      } catch (error) {
        reject(error);
      }
    })
  };
/* 
  Read more notifications, max 10 item onetime
  @param {string} currentUserId
  @param {number} skipNumberNotification
*/
  readMore(currentUserId, skipNumberNotification){
    return new Promise(async (resolve, reject) => {
      try {
        let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMER_TAKEN);
        let getNotifContent = newNotifications.map(async (notification) => {
          let sender = await UserModel.findUserById(notification.senderId);
          return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
        });

        resolve(await Promise.all(getNotifContent));
      } catch (error) {
        reject(error);
      }
    })
  };
}

module.exports = new NotificationService
