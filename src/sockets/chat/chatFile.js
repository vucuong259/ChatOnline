import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from '../../helpers/socketHelper';
/* 
  Param: io from socket.io lib
*/
let chatFile = (io) => {
  let clients = {};
  io.on("connection", (socket)=>{

    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on("chat-file", (data)=>{
      if(data.groupId){
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message
        }
        // emit notification
        if(clients[data.groupId]){
          emitNotifyToArray(clients, data.groupId, io, "response-chat-file", response);
        }
      }
      if(data.contactId){
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        }
        // emit notification
        if(clients[data.contactId]){
          emitNotifyToArray(clients, data.contactId, io, "response-chat-file", response);
        }
      }

      
      
    });
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
}
module.exports = chatFile;