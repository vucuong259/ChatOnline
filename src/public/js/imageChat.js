// arraybuffer to base64 encoded string
// https://stackoverflow.com/a/42334410
function bufferToBase64(buffer){
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}
function imageChat(divId){
  $(`#image-chat-${divId}`).unbind("change").on("change", function(){
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // byte = 1M

    // kiểm tra kiểu dữ liệu ảnh truyền vào
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify(
        "Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.",
        "error",
        7
      );
      $(this).val(null);
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1M", "error", 7);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;
    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function (data) {
        let dataToEmit = {
          message: data.message
        };
        // step 1: handle message data before show
        let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat" />`;
        if(isChatGroup){
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${imageChat}`);
          
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(imageChat);

          dataToEmit.contactId = targetId;
        }
        // step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId)
        // step 3: remove data all input: nothing to code

        // step 4: change data preview & time in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");
        // step 5: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("testnamespace.moveConversationToTheTop", function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("testnamespace.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("testnamespace.moveConversationToTheTop");
        // step 6: Emit realtime
        socket.emit("chat-image", dataToEmit);
        // step 7: Add to modal image
        let imageChatToAddModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`;
        $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
      },
      error: function (error) {
        alertify.notify(error.responseText,"error",7);
      },
    });
  
  });
}

$(document).ready(function(){
  socket.on("response-chat-image", function(response){
    let divId = "";
    // step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let imageChat = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat" />`;
    if(response.currentGroupId){
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${imageChat}`);
      divId = response.currentGroupId
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else {
      divId = response.currentUserId
      messageOfYou.html(imageChat);
    }

    // step 2: append message data to screen
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // step 3: remove data all input : nothing to code
    // step 4: change data preview & time in leftside
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

    // step 5: move conversation to the top
    $(`.person[data-chat=${divId}]`).on("testnamespace.moveConversationToTheTop", function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("testnamespace.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("testnamespace.moveConversationToTheTop");
    // step 6: Emit realtime: nothing to code
    // step 7: Add to modal image
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      let imageChatToAddModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">`;
      $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
    }
  });
});