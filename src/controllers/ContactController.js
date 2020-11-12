import {contact} from './../services';
import {validationResult} from 'express-validator';

class ContactController {
  async findUsersContact(req, res){
    let errorArr = [];
    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });

      return res.status(500).send(errorArr);
    }
    try {
      let currentUserId = req.user._id;
      let keyword = req.params.keyword;

      let users = await contact.findUsersContact(currentUserId, keyword);
      return res.render('main/contact/sections/_findUsersContact', {users});
    } catch (error) {
      return res.status(500).send(error);
    }
  };
  async addNew(req, res){
    try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;

      let newContact = await contact.addNew(currentUserId, contactId);
      return res.status(200).send({success:!!newContact});
    } catch (error) {
      return res.status(500).send(error);
    }
  };
  async removeRequestContactSent(req, res){
    try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;

      let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
      return res.status(200).send({success:!!removeReq});
    } catch (error) {
      return res.status(500).send(error);
    }
  };
  async removeRequestContactReceived(req, res){
    try {
      let currentUserId = req.user._id;
      let contactId = req.body.uid;

      let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
      return res.status(200).send({success:!!removeReq});
    } catch (error) {
      return res.status(500).send(error);
    }
  };
  async readMoreContacts(req, res){
    try {
      // get skipNumber from query param
      let skipNumberContacts = +(req.query.skipNumber);
      // get more item
      let newContactsUsers = await contact.readMoreContacts(req.user._id, skipNumberContacts);
      return res.status(200).send(newContactsUsers);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
  async readMoreContactsSent(req, res){
    try {
      // get skipNumber from query param
      let skipNumberContacts = +(req.query.skipNumber);
      // get more item
      let newContactsUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
      return res.status(200).send(newContactsUsers);
    } catch (error) {
      return res.status(500).send(error);
    }
  };

  async readMoreContactsReceived(req, res){
    try {
      // get skipNumber from query param
      let skipNumberContacts = +(req.query.skipNumber);
      // get more item
      let newContactsUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContacts);
      return res.status(200).send(newContactsUsers);
    } catch (error) {
      return res.status(500).send(error);
    }
  };

}

module.exports = new ContactController