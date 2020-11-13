import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
    createNew(item) {
        return this.create(item);
    },

    findAllByUser(userId){
        return this.find({
            $or: [
                {'userId': userId},
                {'contactId': userId}
            ]
        }).exec();
    },
    // check exists of 2 user
    checkExists(userId, contactId){
        return this.findOne({
            $or:[
                {$and:[
                    {"userId": userId},
                    {"contactId": contactId}
                ]},
                {$and:[
                    {"contactId": userId},
                    {"userId": contactId}
                ]}
            ]
        }).exec();
    },
    removeContact(userId, contactId){
        return this.deleteOne({
            $or:[
                {$and:[
                    {"userId": userId},
                    {"contactId": contactId},
                    {"status": true}
                ]},
                {$and:[
                    {"contactId": userId},
                    {"userId": contactId},
                    {"status": true}
                ]}
            ]
        }).exec();
    },
    //Remove request contact sent
    removeRequestContactSent(userId, contactId) {
        return this.deleteOne({
            $and:[
                {"userId": userId},
                {"contactId": contactId},
                {"status": false}
            ]
        }).exec();
    },
    //Remove request contact received
    removeRequestContactReceived(userId, contactId) {
        return this.deleteOne({
            $and:[
                {"contactId": userId},
                {"userId": contactId},
                {"status": false}
            ]
        }).exec();
    },

    approveRequestContactReceived(userId, contactId) {
        return this.updateOne({
            $and:[
                {"contactId": userId},
                {"userId": contactId},
                {"status": false}
            ]
        },{"status": true,
            "updatedAt": Date.now()
        }).exec();
    },

    getContacts(userId, limit) {
        return this.find({
            $and:[
                {$or:[{
                    "userId": userId
                },{
                    "contactId": userId
                }]},
                {"status": true}
            ]
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },
    getContactSent(userId, limit) {
        return this.find({
            $and:[
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
    getContactReceived(userId, limit) {
        return this.find({
            $and:[
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
    countAllContacts(userId) {
        return this.countDocuments({
            $and:[
                {$or:[{
                    "userId": userId
                },{
                    "contactId": userId
                }]},
                {"status": true}
            ]
        }).exec();
    },
    countAllContactsSent(userId) {
        return this.countDocuments({
            $and:[
                {"userId": userId},
                {"status": false}
            ]
        }).exec();
    },
    countAllContactsReceived(userId) {
        return this.countDocuments({
            $and:[
                {"contactId": userId},
                {"status": false}
            ]
        }).exec();
    },
    readMoreContacts(userId, skip, limit) {
        return this.find({
            $and:[
                {$or:[{
                    "userId": userId
                },{
                    "contactId": userId
                }]},
                {"status": true}
            ]
        }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
    },

    readMoreContactsSent(userId, skip, limit) {
        return this.find({
            $and:[
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },

    readMoreContactsReceived(userId, skip, limit) {
        return this.find({
            $and:[
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    }
};

module.exports = mongoose.model('contact', ContactSchema);