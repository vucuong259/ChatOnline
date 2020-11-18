// arraybuffer to base64 encoded string
// https://stackoverflow.com/a/42334410
function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}
function imageFile(divId) {
  $(`#attach-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0];
      let limit = 10485760; // byte = 10M

      if (fileData.size > limit) {
        alertify.notify("Ảnh file tối đa cho phép là 10M", "error", 7);
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;
      let fileFormData = new FormData();
      fileFormData.append("my-attach-chat", fileData);
      fileFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        fileFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "/message/add-new-file",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: fileFormData,
        success: function (data) {
          let dataToEmit = {
            message: data.message,
          };
          // step 1: handle message data before show
          let messageOfMe = $(
            `<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`
          );
          let fileChat = `<a
          href="data:${data.message.file.contentType}; base64, ${bufferToBase64(
              data.message.file.data.data
            )}"
          download="${data.message.file.fileName}"
          >
          ${data.message.file.fileName}
          </a>`;

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
            messageOfMe.html(`${senderAvatar} ${fileChat}`);

            increaseNumberMessageGroup(divId);
            dataToEmit.groupId = targetId;
          } else {
            messageOfMe.html(fileChat);

            dataToEmit.contactId = targetId;
          }
          // step 2: append message data to screen
          $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
          nineScrollRight(divId);
          // step 3: remove data all input: nothing to code

          // step 4: change data preview & time in leftside
          $(`.person[data-chat=${divId}]`)
            .find("span.time")
            .removeClass("message-time-realtime")
            .html(
              moment(data.message.createdAt)
                .locale("vi")
                .startOf("seconds")
                .fromNow()
            );
          $(`.person[data-chat=${divId}]`)
            .find("span.preview")
            .html("Tệp đính kèm...");
          // step 5: move conversation to the top
          $(`.person[data-chat=${divId}]`).on(
            "testnamespace.moveConversationToTheTop",
            function () {
              let dataToMove = $(this).parent();
              $(this).closest("ul").prepend(dataToMove);
              $(this).off("testnamespace.moveConversationToTheTop");
            }
          );
          $(`.person[data-chat=${divId}]`).trigger(
            "testnamespace.moveConversationToTheTop"
          );
          // step 6: Emit realtime
          socket.emit("chat-file", dataToEmit);
          // step 7: Add to modal image
          let fileChatToAddModal = `<li>
          <a href="data:${
            data.message.file.contentType
          }; base64, ${bufferToBase64(data.message.file.data.data)}" 
          download="${data.message.file.fileName}">
              ${data.message.file.fileName}
          </a>
          </li>`;

          $(`#attachsModal_${divId}`)
            .find("ul.list-attachs")
            .append(fileChatToAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 7);
        },
      });
    });
}

$(document).ready(function(){
  socket.on("response-chat-file", function(response){
    let divId = "";
    // step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let fileChat = `<a
                    href="data:${response.message.file.contentType}; base64, ${bufferToBase64(
                        response.message.file.data.data
                      )}"
                    download="${response.message.file.fileName}"
                    >
                    ${response.message.file.fileName}
                    </a>`;
    if(response.currentGroupId){
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${fileChat}`);
      divId = response.currentGroupId
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else {
      divId = response.currentUserId
      messageOfYou.html(fileChat);
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
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

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
      let fileChatToAddModal = `<li>
          <a href="data:${
            response.message.file.contentType
          }; base64, ${bufferToBase64(response.message.file.data.data)}" 
          download="${response.message.file.fileName}">
              ${response.message.file.fileName}
          </a>
          </li>`;

          $(`#attachsModal_${divId}`)
            .find("ul.list-attachs")
            .append(fileChatToAddModal);
    }
  });
});
