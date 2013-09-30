/*
 * Proof of concept of framework to achieve A/B testing tracking based on Javascript
 * LXJS 2012 Booking.com workshop
 * https://github.com/apardolopez/LXJS-workshop
 *
 * Copyright Alejandro Pardo Lopez and other contributors
 * Released under the MIT license
 *
 * Date: 01-10-2013
 */

(function (trackingSettings, window, document, undefined) {

	var img,
		settings = trackingSettings || {},
		trackInProgress = false,
		queue = [],
		queuePointer = 0,
		lastRequestedQueuePointer = 0,
		defaultMaxErrorTries = 5,
		errorTries = settings.maxTries ? settings.maxTries : defaultMaxErrorTries,
		frameworkNamespace = trackingSettings.namespace ? trackingSettings.namespace : 'userExpTracking',
		trackingImgUrl = trackingSettings.imgUrl ? trackingSettings.imgUrl : 'http://q-ec.bstatic.com/images/misc_images/citymab_MAB_-2601889_02.jpg';

	// Expose function that tracks users into our A/B test
	window[frameworkNamespace] = {
		trackTest: function(testData) {
			// We are tracking test ids for now
			if(!testData) return;
	
			// Push data into our queue and increment pointer
			queue.push(JSON.stringify(testData));
			queuePointer++;

			// If we haven't requested tracking img, do so
			// Otherwise, keep our data in the queue to avoid potential cookie overrides
			if(!trackInProgress) {
				requestTrackingImg();
			}
		}
	};

	var requestTrackingImg = function() {
		var url = trackingImgUrl;

		// Add all experiment data. Each experiment data is separated by "|" char
		url += '?exp_data=' + queue.join('|');

		// Flag to indicate whether we have to request an img or just queue the data until previous img has been loaded
		trackInProgress = true;

		img = document.createElement('img');

		lastRequestedQueuePointer = queuePointer;
		img.onload = function() {
			// Clear queue and localStorage data
			queue = queue.slice(lastRequestedQueuePointer);
			if(queue.length) {
				requestTrackingImg();
			}
			
			// Reset flag
			trackInProgress = false;
			// Reset max error tries
			errorTries = settings.maxTries ? settings.maxTries : defaultMaxErrorTries;
		};

		// If img request fails, try until 
		img.onerror = function() {
			if(errorTries) {
				errorTries--;
				// Reset flag
				trackInProgress = false;
				// Try again
				requestTrackingImg();
			}
		};

		img.src = url;
	};
})({},window, document);
