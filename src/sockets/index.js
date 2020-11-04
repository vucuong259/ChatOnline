import addNewContact from "./contact/addNewContact";
/* 
  Param: io from socket.io lib
*/
let initSockets = (io) => {
  addNewContact(io);
  //
}

module.exports = initSockets;