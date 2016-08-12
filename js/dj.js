var dingbuffer = null;
var revdingbuffer = null;

function playSound(buffer) {
  var source = audioCtx.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(masterGain);       // connect the source to the context's destination (the speakers)
  source.noteOn(0);                          // play the source now
}

function crossfade(value) {
  // equal-power crossfade
  var gain1 = Math.cos(value * 0.5*Math.PI);
  var gain2 = Math.cos((1.0-value) * 0.5*Math.PI);

  leftTrack.xfadeGain.gain.value = gain1;
  rightTrack.xfadeGain.gain.value = gain2;
}

// logResponse gives us a more "musical" frequency response
// for filter frequency, etc, for a control dial - it gives a
// 2^x exponential curve response for an input of [0,1], returning [0,1].
function logResponse( input ) {
   return ( Math.pow(2,((input*4)-1)) - 0.5)/7.5;
}

function cue(event) {
  var track = event.target.parentNode.track;

  // TODO: should handle the MIDI sends here
  if (track.cuePoint) {
    // jump to cuePoint
    track.jumpToCuePoint();
  } else {
    track.setCuePointAtCurrentTime();
    event.target.classList.add("active");
  }
  event.preventDefault();
}

function handleFileDrop(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  console.log( "Dropped: " + evt.dataTransfer.files[0].name );
} 

//init: create plugin
window.addEventListener('load', function() {
  audioCtx = new AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.connect( audioCtx.destination );
  runningDisplayContext = document.getElementById("wavedisplay").getContext("2d");

  leftTrack = new Track( "sounds/Untitled2.mp3", true );

  var request = new XMLHttpRequest();
  request.open("GET", "sounds/ding.ogg", true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    audioCtx.decodeAudioData( request.response, function(buffer) { 
        dingbuffer = buffer;
        revdingbuffer = reverseBuffer(buffer);
    } );
  }
  request.send();
  tracks = document.getElementById( "trackContainer" );
  updatePlatters( 0 );

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

});

var rafID = null;
var tracks = null;

function updatePlatters( time ) {
  runningDisplayContext.clearRect(0,0,RUNNING_DISPLAY_WIDTH,RUNNING_DISPLAY_HEIGHT);
  for (var i=0; i<tracks.children.length; i++)
    tracks.children[i].track.updatePlatter( true );

  rafID = window.requestAnimationFrame( updatePlatters );
}


//
// leap Motion Roll - Picth - Yaw 
//
var paused = false;
//
// SpaceBar click is pause
//
window.onkeypress = function(e) {
	if (e.charCode == 32) {
		if (paused == false) {
			paused = true;
		} else {
			paused = false;
		}
	}
};

var controller = new Leap.Controller({enableGestures: true});

controller.loop(function(frame) {
	latestFrame = frame;
	if (paused) {
		document.getElementById('pause').innerHTML = "<strong>PAUSED</strong>";
		return;
	}

	var str = "";
	var scratch = document.getElementById('scratch');
	for (var i in frame.handsMap) {
		var hand = frame.handsMap[i];
		var position = hand.palmNormal[1] * 10;
		var yv_pos = hand.palmVelocity[1];
		var zv_pos = hand.palmVelocity[2];
		
		str += "<p>" +
			"<strong>Roll:</strong> " + hand.roll() +
			"<br/><strong>Pitch:</strong> " + hand.pitch() +
			"<br/><strong>Yaw:</strong> " + hand.yaw() +
			"<br/><strong>Position Y:</strong>" + position +
			"<br/><strong>y_velocity :</strong> " + yv_pos +
			"<br/><strong>z_velocity :</strong> " + zv_pos +
			"</p>";
			
		///
		/// Tempo Control
		///
			
		if( zv_pos > 300 ) {
		}
		
		if ( zv_pos < -300 ) {
		}
		
		//
		// Volume Control
		//
		
		if( yv_pos > 300 ){
		}
		if( yv_pos < -300 ){
		}
		
		//
		// DJ Scratch
		//
		if( hand.yaw() < -0.7 ) {
			scratch.value = parseFloat(scratch.value) + 0.05;
			leftTrack.pbrText = parseFloat(scratch.value);
			console.log(scratch.value);
		}	
		if( hand.yaw() > 0.7 ) {
			scratch.value = parseFloat(scratch.value) - 0.05;
			console.log(scratch.value);
		}	
		
	}
	document.getElementById('out').innerHTML = str;
});
