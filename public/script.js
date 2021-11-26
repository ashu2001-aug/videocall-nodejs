
const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo  = document.createElement('video');
myVideo.muted = true;
const peers ={}

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
      })
  })

  socket.on('user-connected', (userId) =>{
      setTimeout(() => {
        connectToNewUser(userId, stream)
      }, 3000)
     // $('.user').append(`<span class='user'>${participents}</span>`)
    console.log('user connected: '+userId);
    
})


$('.leave_meeting').click(function() {
    socket.emit('remove');
})
socket.on('removed', (userId)=>{
    
    console.log('user removed: '+userId);
    //console.log('room removed: '+roomId);
})

let text = $('input')

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('')
    }
})


socket.on('createMessage', (message, userId) =>{
    console.log('server '+message +userId)
    $('ul').append(`<li class="message"><b>${userId}</b><br/>${message}</li>`);
    scrollTobollom()
})
socket.on('user-disconnected',userId =>{
    setTimeout(() => {
        if(peers[userId]) peers[userId].close()
      }, 3000)
     // $('.user').append(`<span class='user'>${participents}</span>`)
    console.log('user disconnected: '+userId);})

/*socket.on('user-disconnected',userId =>{
    setTimeout(() => {
        if(peers[userId]) peers[userId].close()
      }, 3000)
     // $('.user').append(`<span class='user'>${participents}</span>`)
    console.log('user disconnected: '+userId);
    
})*/

/*socket.on('createMessage', message =>{
    console.log('server '+message)
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollTobollom()
})*/

 /* peer.on('call',call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })*/
  
  
 /* socket.on('user-connected', (userId) =>{
    connectToNewUser(userId, stream);
})*/

})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})
//socket.emit('join-room', ROOM_ID);


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () =>{
        video.remove()
    })
    peers[userId]=call
}

/*const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}*/




const addVideoStream = (video, stream) => {
    video.srcObject= stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    videoGrid.append(video);
}


const scrollTobollom = () => {
    let d = $(".main_chat_window");
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i>
    <span>Unute</span>`
    document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i>
    <snap>Stop video</snap>`
    document.querySelector('.main_video_button').innerHTML = html;
}



const setPlayVideo = () => {
    const html = `<i class="play fas fa-video-slash"></i>
    <snap>Play video</snap>`
    document.querySelector('.main_video_button').innerHTML = html;
}