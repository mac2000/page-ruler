/**
 * Analytics class
 */

// set up analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44581945-2']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function(pr) {

pr.Analytics = {

	/**
	 * Checks that analytics is enabled by the 'statistics' setting
	 * If enabled, the callback function is called which will contain the tracking code
	 *
	 * @param {Function} callback
	 */
	checkEnabled: function(callback) {

		chrome.storage.sync.get('statistics', function(items) {

			var enabled = !!items.statistics;

			if (!enabled) {
				console.log('statistics disabled');
			}
			else {
				callback();
			}

		});

	},

	/**
	 * Tracks a pageview
	 *
	 * @param {String} page
	 */
	trackPageview: function(page) {

		console.log('Analytics.trackPageview: ', page);

		// if analytics is enabled track the pageview
		this.checkEnabled(function() {

			var args = ['_trackPageview', page];

			_gaq.push(args);

			console.log('trackPageview sent: ', args);

		});

	},

	/**
	 * Tracks an event
	 *
	 * @param {String} category
	 * @param {String} action
	 * @param {String} label
	 * @param {Number} value
	 */
	trackEvent: function(category, action, label, value) {

		console.log('Analytics.trackEvent: ', arguments);

		// if analytics is enabled track the event
		this.checkEnabled(function() {

			// construct event arguments
			var args = [
				'_trackEvent',
				category,
				action
			];

			// optional args
			if (!!label) {
				args.push(label)
				if (!!value) {
					args.push(value);
				}
			}

			_gaq.push(args);

			console.log('trackEvent sent: ', args);

		});

	}

};

})(PageRuler);