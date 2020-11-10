import {notification} from './../services';

class NotificationController{
  async readMore(req, res){
    try {
      // get skipNumber from query param
      let skipNumberNotification = +(req.query.skipNumber);
      // get more item
      let newNotification = await notification.readMore(req.user._id, skipNumberNotification);
      return res.status(200).send(newNotification);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async markAllAsRead(req, res){
    try {
      let mark = await notification.markAllAsRead(req.user._id, req.body.targetUsers);
      return res.status(200).send(mark);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

}

module.exports = new NotificationController;
