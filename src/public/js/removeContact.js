function removeContact() {
  // unbind để hủy tất cả các sự kiện duplicate click đi
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      let username = $(this).parent().find('div.user-name p').text();
      Swal.fire({
        title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ?`,
        text: "Bạn không thể hoàn tác lại quá trình này",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ECC71',
        cancelButtonColor: '#ff7675',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if(!result.value){
          $('#input-btn-cancel-update-user-password').click();
          return false;
        }
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {
              $("#contacts").find(`ul li[data-uid= ${targetId}]`).remove();
              decreaseNumberNotiContact("count-contacts");
              // sau này làm chức năng chat thì sẽ xóa tiếp user ở phần chat
              socket.emit("remove-contact", {
                contactId: targetId,
              });
              // Xử lý realtime ở bài sau
            }
          },
        });
      })
      

      
    });
}

socket.on("response-remove-contact", function (user) {
  $("#contacts").find(`ul li[data-uid= ${user.id}]`).remove();
  decreaseNumberNotiContact("count-contacts");
  // sau này làm chức năng chat thì sẽ xóa tiếp user ở phần chat
 });

$(document).ready(function () {
  removeContact();
});
