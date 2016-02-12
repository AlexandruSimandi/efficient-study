$(document).ready(function() {
//	$(".button-collapse").sideNav();
//	$('select').material_select();
	loadEvents();
});

function loadEvents(){
//	var sound = new buzz.sound('/sound/bell', {formats: ['mp3', 'wav']});
	var audio = new Audio('sound/bell.mp3');
	var alreadyFired = false;
	var interval;
	$('#setTimer').click(function(){
		if(alreadyFired){
			clearInterval(interval);
		} else {
			Materialize.toast('Best of luck studying!',6000);
		}
		var studyTime = parseInt(document.getElementById('studyTime').value);
		var pauseTime = parseInt(document.getElementById('pauseTime').value);

		var hours = Math.floor(studyTime / 60);
		var minutes = studyTime % 60;
		var seconds = 0;

		var oldHours = hours;
		var oldMinutes = minutes;

		document.getElementById('seconds').innerHTML = '0s';
		document.getElementById('minutes').innerHTML = minutes + 'm';
		document.getElementById('hours').innerHTML = hours + 'h';

		var isStudyTime = true;

		interval = setInterval(function(){
			if(seconds == 0 ){
				if(minutes == 0){
					if(hours == 0){
						if(isStudyTime){
							isStudyTime = false;
							minutes = pauseTime;
							document.getElementById('status').innerHTML = 'Break time';
							Materialize.toast('Take a break, do something fun, come back when timer ends break',14000);
						} else {
							isStudyTime = true;
							hours = oldHours;
							minutes = oldMinutes;
							document.getElementById('status').innerHTML = 'Study time';
							Materialize.toast('Hope you enjoyed your break, time to get back to study',14000);
						}
						audio.play();
					} else {
						hours--;
						minutes = 59;
						seconds = 59;
					}
					updateTime('hours', hours);
				} else {
					minutes--;
					seconds = 59;
				}
				updateTime('minutes', minutes);
			} else {
				seconds--;
			}
			updateTime('seconds', seconds);
		},1000);

		alreadyFired = true;

	});

	//////////////////////////////

	var hidden, visibilityChange;
	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

//	var hoursH1 = document.getElementById("hours");

	// If the page is hidden, pause the video;
	// if the page is shown, play the video
	function handleVisibilityChange() {
		if (document[hidden]) {
//			hoursH1.innerHTML = 'hey!';
		} else {
//			hoursH1.innerHTML = 'oh you are back';
			var secondsH1 = $('#seconds');
			secondsH1.stop(true, true);
			secondsH1.animate({
				//marginTop: 0,
				opacity: 1.0
			}, 1, function(){});
		}
	}

	// Warn if the browser doesn't support addEventListener or the Page Visibility API
	if (typeof document.addEventListener === "undefined" ||
		typeof document[hidden] === "undefined") {
		alert("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
	} else {
		// Handle page visibility change
		document.addEventListener(visibilityChange, handleVisibilityChange, false);

	}

	////////////////////
}

function updateTime(element, value) {
	var secondsH1 = document.getElementById(element);
	$(secondsH1).animate({
		//marginTop: -20,
		opacity: 0.0
	}, 200, 'swing', function(){});

	setTimeout(function(){
		secondsH1.innerHTML = value + element.charAt(0);
		$(secondsH1).animate({
			//marginTop: 20,
			opacity: 0.5
		}, 1, 'linear', function(){});
		$(secondsH1).animate({
			//marginTop: 0,
			opacity: 1.0
		}, 200, 'swing', function(){});
	}, 200);
}

