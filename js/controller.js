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
	for (var i in frame.handsMap) {
		var hand = frame.handsMap[i];
		var position = hand.palmNormal[1] * 10;
		var yv_pos = hand.palmVelocity[1];
		var zv_pos = hand.palmVelocity[2];
		
		str += "<p color="white">" +
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
			if ( leftSong != null) {
				if( leftSong.playbackRate > 1.9 ) {
					leftSong.playbackRate = 2;
				} 
				else {
					leftSong.playbackRate = leftSong.playbackRate + 0.1;
				}
			}
		}
		
		if ( zv_pos < -300 ) {
			if ( leftSong != null ) {
				if ( leftSong.playbackRate < 0.6 ) {
					leftSong.playbackRate = 0.5;
				}
				else {
					leftSong.playbackRate = leftSong.playbackRate - 0.1;
				}
			}
		}
		
		//
		// Volume Control
		//
		
		if( yv_pos > 300 ){
			if (leftSong != null) {
				if(leftSong.volume > 0.9){
					leftSong.volume = 1;
				}
				else{				
				leftSong.volume = leftSong.volume + 0.1;
				}
			}
		}
		if( yv_pos < -300 ){
			if (leftSong != null) {    
				if(leftSong.volume < 0.1){
					leftSong.volume = 0;
				}
				else{				
				leftSong.volume = leftSong.volume - 0.1;
				}
			}
		}
		
		//
		// DJ Scratch
		//
		if( hand.yaw() < -0.7 ) {
			if (leftSong != null) {    
				leftSong.currentTime-=timeFactor;
				$('#left .jog').addClass('reverse');
				
			}
		}
		else {
				$('#left .jog').removeClass('reverse');
				$('#left .jog').addClass('running');
		}	
		
	}
	console.log(str);
	document.getElementById('out').innerHTML = str;

});
