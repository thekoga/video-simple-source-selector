/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var publisher;

const videoSelector = document.querySelector('#video-source-select');






// Allow you to switch to different cameras and microphones using
// setAudioSource and cycleVideo
function setupDeviceSwitching() {
	videoSelector.disabled = false;

	// When the audio selector changes we update the audio source
	videoSelector.addEventListener('change', () => {
		videoSelector.disabled = true;
		publisher.setVideoSource(event.target.value).then(() => {
			videoSelector.disabled = false;
		}).catch((err) => {
			alert(`setVideoSource failed: ${err.message}`);
			videoSelector.disabled = false;
		});
	});
}



// Get the list of devices and populate the drop down lists
function populateDeviceSources(selector, kind) {
	OT.getDevices((err, devices) => {
		console.log("LOG: OT.getDevices()");
		console.log(devices);
		if (err) {
			alert('getDevices error ' + err.message);
			return;
		}
		let index = 0;
		selector.innerHTML = devices.reduce((innerHTML, device) => {
			if (device.kind === kind) {
				index += 1;
				return `${innerHTML}<option value="${device.deviceId}">${device.label || device.kind + index}</option>`;
			}
			return innerHTML;
		}, '');
	});
}

// We request access to Microphones and Cameras so we can get the labels
OT.getUserMedia().then((stream) => {
	console.log("LOG: OT.getUserMedia()");
	console.log(stream);
	populateDeviceSources(videoSelector, 'videoInput');
	// Stop the tracks so that we stop using this camera and microphone
	// If you don't do this then cycleVideo does not work on some Android devices
	stream.getTracks().forEach(track => track.stop());
});




// initialize the publisher
var publisherOptions = {
	insertMode: 'append',
	width: '100%',
	height: '100%'
};


publisher = OT.initPublisher('publisher', publisherOptions, function(error){
	if(error){
		console.log(error);
	}
	else{
		setupDeviceSwitching();
	}
});


