

function removeRequestContactSent() {
  // unbind để hủy tất cả các sự kiện duplicate click đi
  $(".user-remove-request-contact-sent").unbind("click").on("click",function(){
    let targetId = $(this).data('uid');
    $.ajax({
      url: "/contact/remove-request-contact-sent",
      type: "delete",
      data: {uid: targetId},
      success: function(data){
        if(data.success){
          $("#find-user").find(`div.user-add-new-contact[data-uid= ${targetId}]`).css("display", "inline-block");
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid= ${targetId}]`).hide();
          decreaseNumberNotiContact("count-request-contact-sent");
          // xóa ở modal tab đang chờ xác nhận
          $('#request-contact-sent').find(`li[data-uid= ${targetId}]`).remove();
          socket.emit("remove-request-contact-sent", {contactId: targetId});
          // Xử lý realtime ở bài sau
        }
      }
    });
  });
}

socket.on("response-remove-request-contact-sent", function (user) {
  $(".noti_content").find(`div[data-uid=${user.id}]`).remove(); // popup notification
  $(".list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove(); // modal notification
  
  // xóa ở modal tab yêu cầu kết bạn
  $("#request-contact-received").find(`li[data-uid= ${user.id}]`).remove();
  decreaseNumberNotiContact("count-request-contact-received");
  decreaseNumberNotification("noti_contact_counter",1);
  decreaseNumberNotification("noti_counter",1);
});

$(document).ready(function (){
  removeRequestContactSent();
})