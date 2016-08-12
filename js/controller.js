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
			console.log(scratch.value);
		}	
		if( hand.yaw() > 0.7 ) {
			Num(scratch.value) = parseFloat(scratch.value) - 0.05;
			console.log(scratch.value);
		}	
		
	}
	document.getElementById('out').innerHTML = str;

});
