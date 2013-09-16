// Extend local storage and page reload

(function (window, $) {

	var img,
		trackInProgress = false,
		queue = [];

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
		var url = '';

		trackInProgress = true;

		img = document.createElement('img');
		
		img.onload = function() {
			// Clear queue
			queue = [];
			// Reset flag
			trackInProgress = false;
			
		};
		
		img.onerror = function() {
			// Reset flag
			trackInProgress = false;
			// Try again
			requestTrackingImg();
			// Some cleverer mechanism would prevent this from making many calls
		}
		
	}	
	
})(window, jQuery);
