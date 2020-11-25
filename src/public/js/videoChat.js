function openStream(){
  const config = { audio: false, video: true};
  return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream){
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
function stopStreamedVideo(idVideoTag) {
  const video = document.getElementById(idVideoTag);
  const localStream = video.srcObject;
  localStream.getTracks()[0].stop();
  video.src = '';
  video.pause();
}
function videoChat(divId){
  $(`#video-chat-${divId}`).unbind("click").on("click", function(){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };

    // step 01 of caller:
    socket.emit("caller-check-listener-online-or-not", dataToEmit);
  })
}
$(document).ready(function(){
    // step 02 of caller:
    socket.on("server-send-listener-is-offline", function(){
      alertify.notify("Người dùng này hiện không trực tuyến.","error", 7);
    });
    let getPeerId = "";
    const peer = new Peer();
    peer.on("open", function(peerId) {
      getPeerId = peerId;
    })
    // step 03 of listener:
    socket.on("server-request-peer-id-of-listener", function(response){
      let listenerName = $("#navbar-username").text();
      let dataToEmit = {
        callerId: response.callerId,
        listenerId: response.listenerId,
        callerName: response.callerName,
        listenerName: listenerName,
        listenerPeerId: getPeerId
      }
      // step 04 of listener:
      socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    });
    // step 05 of caller:
    socket.on("server-send-peer-id-of-listener-to-caller", function(response){
      let dataToEmit = {
        callerId: response.callerId,
        listenerId: response.listenerId,
        callerName: response.callerName,
        listenerName: response.listenerName,
        listenerPeerId: response.listenerPeerId
      };
      // step 06 of caller:
      socket.emit("caller-request-call-to-server", dataToEmit);

      let timerInterval;
      Swal.fire({
        title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volumn-control-phone"></i>`,
        html: `
          Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
          <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>
        `,
        backdrop: "rgba(85,85,85, 0.4)",
        width: "52rem",
        allowOutsideClick: false,
        timer: 30000,
        onBeforeOpen: () => {
          $("#btn-cancel-call").unbind("click").on("click", function(){
            Swal.close();
            clearInterval(timerInterval);
            // step 07 of caller:
            socket.emit("caller-cancel-request-call-to-server", dataToEmit);
          });
          Swal.showLoading();
          timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000); 
          }, 1000);
        },
        onOpen: () => {
          // step 12 of caller
          socket.on("server-send-reject-call-to-caller", function(response){
            Swal.close();
            clearInterval(timerInterval);
            Swal.fire({
              type:"info",
              title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
              backdrop: "rgba(85,85,85, 0.4)",
              width: "52rem",
              allowOutsideClick: false,
              confirmButtonColor: '#2ECC71',
              confirmButtonText: 'Xác nhận',
            })
          });
          // step 13 of caller
          socket.on("server-send-accept-call-to-caller", function(response){
            Swal.close();
            clearInterval(timerInterval);
            $("#streamModal").modal("show");
            openStream()
              .then(stream => {
                playStream('local-stream',stream);
                const call = peer.call(response.listenerPeerId,stream);
                call.on('stream', removeStream => playStream('remote-stream',removeStream));
              });

              $("#streamModal").unbind('hide.bs.modal').on('hide.bs.modal', function(){
                stopStreamedVideo("remote-stream");
                stopStreamedVideo("local-stream");
                Swal.fire({
                  type:"info",
                  title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span>`,
                  backdrop: "rgba(85,85,85, 0.4)",
                  width: "52rem",
                  allowOutsideClick: false,
                  confirmButtonColor: '#2ECC71',
                  confirmButtonText: 'Xác nhận',
                })
              });
          });
          
        },
        onClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        return false;
      });
    });
    // step 08 of listener:
    socket.on("server-send-request-call-to-listener", function(response){
      let dataToEmit = {
        callerId: response.callerId,
        listenerId: response.listenerId,
        callerName: response.callerName,
        listenerName: response.listenerName,
        listenerPeerId: response.listenerPeerId
      };
      let timerInterval;
      Swal.fire({
        title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; muốn trò truyện video với bạn <i class="fa fa-volumn-control-phone"></i>`,
        html: `
          Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
          <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
          <button id="btn-accept-call" class="btn btn-success">Nghe</button>
        `,
        backdrop: "rgba(85,85,85, 0.4)",
        width: "52rem",
        allowOutsideClick: false,
        timer: 30000,
        onBeforeOpen: () => {
          $("#btn-reject-call").unbind("click").on("click", function(){
            Swal.close();
            clearInterval(timerInterval);
            // step 10 of listener
            socket.emit("listener-reject-request-call-to-server", dataToEmit);
            
          });
          $("#btn-accept-call").unbind("click").on("click", function(){
            Swal.close();
            clearInterval(timerInterval);
            // step 11 of listener
            socket.emit("listener-accept-request-call-to-server", dataToEmit);
            
          });
          Swal.showLoading();
          timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000); 
          }, 1000);
        },
        onOpen: () => {
          // step 09 of listener
          socket.on("server-send-cancel-request-call-to-listener", function(response){
            Swal.close();
            clearInterval(timerInterval);
          });

          // step 14 of listener
          socket.on("server-send-accept-call-to-listener", function(response){
            Swal.close();
            clearInterval(timerInterval);
            $("#streamModal").modal("show");
            peer.on("call", call => {
              openStream()
              .then(stream => {
                call.answer(stream);
                playStream('local-stream',stream);
                call.on('stream', removeStream => playStream('remote-stream',removeStream));
              })
            });
            $("#streamModal").unbind('hide.bs.modal').on('hide.bs.modal', function(){
              stopStreamedVideo("remote-stream");
              stopStreamedVideo("local-stream");
              Swal.fire({
                type:"info",
                title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.callerName}</span>`,
                backdrop: "rgba(85,85,85, 0.4)",
                width: "52rem",
                allowOutsideClick: false,
                confirmButtonColor: '#2ECC71',
                confirmButtonText: 'Xác nhận',
              })
            });
          });
          

        },
        onClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        return false;
      });
    });

})