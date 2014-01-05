var canvas = $('#selfie')[0];
var ctx = canvas.getContext('2d');
var video  = document.createElement('video');
video.id="video";

var initCam = function(){
  navigator.getMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

  if(navigator.getMedia == "undefined"){
    alert("webrtc is not supported on this browser. try chrome or firefox.");
  }

  navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
        }

        video.play();

        (function draw() {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          drawVideo();
          ctx.restore();
          drawing = requestAnimationFrame(draw);
        })();
      },
      function(err) {
        console.log("An error occured! " + err);
        alert("Oops! Some sort of error occured, refresh and try again.");
      }
  );
}

var drawVideo = function(){
  try {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    processImage();
  } catch (e) {
    if (e.name == "NS_ERROR_NOT_AVAILABLE") {
      setTimeout(drawVideo, 0);
    } else {
      throw e;
    }
  }
}

var processImage = function(){
  var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var pixData = pixels.data;
  for (i = 0; i < canvas.width; i++) {
    for (j = 0; j < canvas.height; j++) {
      //you can process individual pixels here
      var index = (j*canvas.width+i)*4
      var r = pixData[index];
      var g = pixData[index+1];
      var b = pixData[index+2];
      var alpha = pixData[index+3];
    }
  }
  ctx.putImageData(pixels, 0, 0);
}

$(document).ready(function(){
  initCam();
});
