import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";
import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextEmoji";
/* 
  Param: io from socket.io lib
*/
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  removeContact(io);
  approveRequestContactReceived(io);
  chatTextEmoji(io);
  //
}

module.exports = initSockets;