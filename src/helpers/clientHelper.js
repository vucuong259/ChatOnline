import moment from 'moment';
let bufferToBase64 = (bufferFrom) => {
  return Buffer.from(bufferFrom).toString("base64");
}
let lastItemOfArray = (array) =>{
  if(array.length == 0){
    return [];
  }else{
  return array[array.length-1];
  }
}
let convertTimestampToHumanTime = (timestamp) => {
  if(!timestamp){
    return "";
  }
  return moment(timestamp).locale("vi").startOf("seconds").fromNow()
}
module.exports = {
  bufferToBase64: bufferToBase64,
  lastItemOfArray: lastItemOfArray,
  convertTimestampToHumanTime: convertTimestampToHumanTime
};