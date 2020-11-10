import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
});

NotificationSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    removeRequestContactNotification(senderId, receiverId, type) {
        return this.deleteOne({
            $and:[
                {"senderId": senderId},
                {"receiverId": receiverId},
                {"type": type}
            ]
        }).exec();
    },
    /* 
        String userId
        number limit
    */
    getByUserIdAndLimit(userId, limit) {
        return this.find({
            "receiverId": userId,
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
    /* 
        count all notifications unread
    */
    countNotifUnread(userId){
        return this.countDocuments({
            $and: [
                {"receiverId": userId,},
                {"isRead": false}
            ]
        }).exec();
    },
    /* 
        Read more notifications
    */
    readMore(userId, skip, limit){
        return this.find({
            "receiverId": userId,
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },
    markAllAsRead(userId, targetUsers){
        return this.updateMany({
            $and:[
                {"receiverId": userId},
                {"senderId": {$in: targetUsers}}
            ],
        }, {"isRead": true}).exec();
    }
}

const NOTIFICATION_TYPE = {
    ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENT = {
    getContent: (notificationType, isRead, userId, userName, userAvatar) => {
        if(notificationType === NOTIFICATION_TYPE.ADD_CONTACT){
            if(!isRead){
                return `<div class="notif-readed-false" data-uid="${userId}">
            <img
              class="avatar-small"
              src="images/users/${userAvatar}"
              alt=""
            />
            <strong>${userName}</strong> đã gửi cho bạn một lời mời kết
            bạn! </div>`
            }
            return `<div data-uid="${userId}">
            <img
              class="avatar-small"
              src="images/users/${userAvatar}"
              alt=""
            />
            <strong>${userName}</strong> đã gửi cho bạn một lời mời kết
            bạn! </div>`
            
        }
        return "No matching with any notification type";
    }
};

module.exports = {
    model: mongoose.model('notification', NotificationSchema),
    types: NOTIFICATION_TYPE,
    contents: NOTIFICATION_CONTENT
};