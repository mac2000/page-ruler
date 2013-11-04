(function() {

	/*
	 * Track pageview
	 */
	chrome.runtime.sendMessage({
		action:	'trackPageview',
		page:	'options.html'
	});

	/*
	 * Locale
	 */
	var elements = document.getElementsByTagName('*');
	for (var i= 0, ilen=elements.length; i<ilen; i++) {
		var element = elements[i];
		if (element.dataset && element.dataset.message) {
			element.innerText = chrome.i18n.getMessage(element.dataset.message);
		}
	}

	/*
	 * Fields
	 */

	// statistics
	var statisticsField = document.getElementById('statistics');

	// populate
	chrome.storage.sync.get('statistics', function(items) {
		statisticsField.checked = !!items.statistics;
	});

	// change
	statisticsField.addEventListener('change', function(e) {

		// disabling option
		if (!this.checked) {

			// track event before saving the setting so we can see how many people disable it
			chrome.runtime.sendMessage(
				{
					action:	'trackEvent',
					args:	['Settings', 'Statistics', '0']
				},
				function() {

					console.log('disabling statistics');

					// save setting
					chrome.storage.sync.set({
						'statistics': false
					});

				}
			);
		}
		// enabling option
		else {

			console.log('enabling statistics');

			// save setting
			chrome.storage.sync.set({
				'statistics': true
			}, function() {

				// send tracking after the setting is saved so it is sent
				chrome.runtime.sendMessage(
					{
						action:	'trackEvent',
						args:	['Settings', 'Statistics', '1']
					}
				)
			});
		}

	}, this);

})();