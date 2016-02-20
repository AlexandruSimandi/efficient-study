var interval;
var alreadyFired = false;
var audio = new Audio('sound/bell.mp3');

$(document).ready(function() {
	loadSavedState();
	loadEvents();
});

function loadSavedState(){
	var savedState = JSON.parse(localStorage.getItem('savedState'));

	if(savedState != null){
		alreadyFired = true;

		if (savedState.isStudyTime) {
			document.getElementById('status').innerHTML = 'Study time';
		} else {
			document.getElementById('status').innerHTML = 'Break time';
		}

		$('#studyTime').attr('value',savedState.studyTime);
		$('#pauseTime').attr('value',savedState.pauseTime);
		$('#studyTimeText').html(savedState.studyTime);
		$('#pauseTimeText').html(savedState.pauseTime);

		var hours = savedState.hours;
		var minutes = savedState.minutes;
		var seconds = savedState.seconds;

		var oldHours = savedState.oldHours;
		var oldMinutes = savedState.oldMinutes;

		var oldPauseTime = savedState.pauseTime;

		document.getElementById('seconds').innerHTML = savedState.seconds + 's';
		document.getElementById('minutes').innerHTML = savedState.minutes + 'm';
		document.getElementById('hours').innerHTML = savedState.hours + 'h';

		var isStudyTime = savedState.isStudyTime;

		interval = setInterval(function(){
			if(seconds == 0 ){
				if(minutes == 0){
					if(hours == 0){
						if(isStudyTime){
							isStudyTime = false;
							minutes = oldPauseTime;
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
			if(isStudyTime){
				$('#progressBar').css('width', 100 - Math.floor((hours * 3600 + minutes * 60 + seconds) / (oldHours * 3600 + oldMinutes * 60) * 100) + '%');
//				console.log(100 - Math.floor((hours * 3600 + minutes * 60 + seconds) / (oldHours * 3600 + oldMinutes * 60) * 100));
			} else {
				$('#progressBar').css('width', 100 - Math.floor((minutes * 60 + seconds) / (oldPauseTime * 60) * 100) + '%');
				//$('#progressBar').width = Math.floor((minutes * 60 + seconds) / (oldPauseTime * 60));
			}

			setTimeOnLocalStorage(isStudyTime, savedState.studyTime, savedState.pauseTime, hours, minutes, seconds, oldHours, oldMinutes);

		},1000);


	}
}

function setTimeOnLocalStorage(isStudyTime, studyTime, pauseTime, hours, minutes, seconds, oldHours, oldMinutes){
	var savedState = new Object();

	savedState.isStudyTime = isStudyTime;

	savedState.studyTime = studyTime;
	savedState.pauseTime = pauseTime;

	savedState.hours = hours;
	savedState.minutes = minutes;
	savedState.seconds = seconds;

	savedState.oldHours = oldHours;
	savedState.oldMinutes = oldMinutes;

	localStorage.setItem('savedState', JSON.stringify(savedState));
}

function loadEvents(){
	$('#studyTime').change(function(){
		document.getElementById('studyTimeText').innerHTML = document.getElementById('studyTime').value;
	});

	$('#pauseTime').change(function(){
		document.getElementById('pauseTimeText').innerHTML = document.getElementById('pauseTime').value;
	});

	$('#setTimer').click(function(){
		if(alreadyFired){
			clearInterval(interval);
			document.getElementById('status').innerHTML = 'Study time';
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

		var oldPauseTime = pauseTime;

		document.getElementById('seconds').innerHTML = '0s';
		document.getElementById('minutes').innerHTML = minutes + 'm';
		document.getElementById('hours').innerHTML = hours + 'h';

		var isStudyTime = true;

		$('#loadingBar').width = 0;

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
			if(isStudyTime){
				$('#progressBar').css('width', 100 - Math.floor((hours * 3600 + minutes * 60 + seconds) / (oldHours * 3600 + oldMinutes * 60) * 100) + '%');
//				console.log(100 - Math.floor((hours * 3600 + minutes * 60 + seconds) / (oldHours * 3600 + oldMinutes * 60) * 100));
			} else {
				$('#progressBar').css('width', 100 - Math.floor((minutes * 60 + seconds) / (oldPauseTime * 60) * 100) + '%');
				//$('#progressBar').width = Math.floor((minutes * 60 + seconds) / (oldPauseTime * 60));
			}

			setTimeOnLocalStorage(isStudyTime, studyTime, pauseTime, hours, minutes, seconds, oldHours, oldMinutes);

		},1000);

		alreadyFired = true;

	});

	$('#clearTimer').click(function(){
		if(alreadyFired){
			localStorage.clear();
			clearInterval(interval);
			document.getElementById('status').innerHTML = 'Study time';
			document.getElementById('seconds').innerHTML = '0s';
			document.getElementById('minutes').innerHTML = '0m';
			document.getElementById('hours').innerHTML = '0h';
			$('#progressBar').css('width','0%');
		}
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

