function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup", function(element){
    let currentEmojioneArea = $(this);
    if (element.which === 13){
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      if(!targetId.length || !messageVal.length){
        return false;
      }
      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };
      if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        dataTextEmojiForSend.isChatGroup = true;
      }
      // call send message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
        let dataToEmit = {
          message: data.message
        };
        // step 1: handle message data before show
        let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);

        let convertEmojiMessage = emojione.toImage(messageOfMe.html());
        if(dataTextEmojiForSend.isChatGroup){
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
          
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId;
        }

        
        // step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId)
        // step 3: remove data all input
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        // step 4: change data preview & time in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
        // step 5: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("testnamespace.moveConversationToTheTop", function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("testnamespace.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("testnamespace.moveConversationToTheTop");
        // step 6: Emit realtime
        socket.emit("chat-text-emoji", dataToEmit);
      }).fail(function(response){
        alertify.notify(response.responseText,"error",7);
      });
    }
  });
}

$(document).ready(function (){
  socket.on("response-chat-text-emoji", function (response){
    let divId = "";
    // step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);

        let convertEmojiMessage = emojione.toImage(messageOfYou.html());
        if(response.currentGroupId){
          let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
          messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
          divId = response.currentGroupId
          if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
            increaseNumberMessageGroup(divId);
          }
        } else {
          divId = response.currentUserId
          messageOfYou.html(convertEmojiMessage);
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
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    // step 5: move conversation to the top
    $(`.person[data-chat=${divId}]`).on("testnamespace.moveConversationToTheTop", function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("testnamespace.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("testnamespace.moveConversationToTheTop");

    // step 6: Emit realtime: nothing to code
  })
})