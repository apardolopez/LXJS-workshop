// Extend local storage and page reload

(function (window) {

	var img,
		trackInProgress = false,
		queue = [],
		errorTries = 5;

	// Some random userID
	window.userId = window.userId || parseInt(Math.random() * 10000, 10);

	// Tracks people into our A/B test
	window.trackTest = function(testId) {
		// We are tracking test ids for now
		if(!testId) return;

		queue.push(testId);

		if(!trackInProgress) {
			// Set flag to prevent further tracking calls to happen
			requestTrackingImg();
		}
	};

	var requestTrackingImg = function() {
		var url = 'test.jpg';

		trackInProgress = true;

		img = document.createElement('img');
		
		img.onload = function() {
			console.log('load');
			// Clear queue
			queue = [];
			// Reset flag
			trackInProgress = false;
			
		};
		
		img.onerror = function() {
			if(errorTries) {
				errorTries--;
				console.log('error');
				// Reset flag
				trackInProgress = false;
				// Try again
				requestTrackingImg();
			}
		}

		img.src = url;
		
		
		
		
		window.testImg = img;
	}	
	
})(window);
