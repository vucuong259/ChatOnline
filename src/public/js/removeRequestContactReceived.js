

function removeRequestContactReceived() {
  // unbind để hủy tất cả các sự kiện duplicate click đi
  $(".user-remove-request-contact-received").unbind("click").on("click",function(){
    let targetId = $(this).data('uid');
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: {uid: targetId},
      success: function(data){
        if(data.success){
          // chức năng này chưa muốn làm
          // $(".noti_content").find(`div[data-uid=${targetId}]`).remove(); // popup notification
          // $(".list-notifications").find(`li>div[data-uid=${targetId}]`).parent().remove(); // modal notification
          // decreaseNumberNotification("noti_counter",1);
          decreaseNumberNotification("noti_contact_counter",1);
          decreaseNumberNotiContact("count-request-contact-received");
          // xóa ở modal tab yêu cầu kết bạn
          $("#request-contact-received").find(`li[data-uid= ${targetId}]`).remove();
          socket.emit("remove-request-contact-received", {contactId: targetId});
          // Xử lý realtime ở bài sau
        }
      }
    });
  });
}

socket.on("response-remove-request-contact-received", function (user) {
  $("#find-user").find(`div.user-add-new-contact[data-uid= ${user.id}]`).css("display", "inline-block");
  $("#find-user").find(`div.user-remove-request-contact-sent[data-uid= ${user.id}]`).hide();  
 
  // xóa ở modal tab đang chờ xác nhận
  $('#request-contact-sent').find(`li[data-uid= ${user.id}]`).remove();
  decreaseNumberNotiContact("count-request-contact-sent");
  decreaseNumberNotification("noti_contact_counter",1);
});

$(document).ready(function (){
  removeRequestContactReceived();
})