// strict mode
"use strict";

var PageRuler = {

	/**
	 * The current version of the addon
	 */
	version:	'2.0.0',

	/**
	 * Addon initialisation
	 */
	init:		function() {

		console.log('init');

		var _this = this;

		// get the stored version - we use this to determine whether the addon has been installed, updated or run
		chrome.storage.sync.get('version', function(items) {

			// get version
			var version = items.version;

			// no version found - new install
			if (!version) {

				console.log('First time install version ', _this.version);

				PageRuler.Analytics.trackEvent('Run', 'Install', _this.version);

				// store initial version and default settings
				chrome.storage.sync.set({
					'version':		_this.version,
					'statistics':	true
				});

			}
			// already installed
			else {

				console.log('Version installed: ', _this.version);

				// new version detected
				if (version !== _this.version) {

					console.log('Update to version: ', _this.version);

					PageRuler.Analytics.trackEvent('Run', 'Update', _this.version);

					// save current version
					chrome.storage.sync.set({
						'version':	_this.version
					});

				}
				// no new version
				else {

					console.log('Existing version run: ', _this.version);

					PageRuler.Analytics.trackEvent('Run', 'Open', _this.version);

				}

			}

		});

	},

	/**
	 * Returns an image object containing all relevant sizes
	 *
	 * @param {String} file
	 * @returns {{19: string, 38: string}}
	 */
	image:		function(file) {

		return {
			"19":	"images/19/" + file,
			"38":	"images/38/" + file
		};

	},

	/**
	 * Loads the addon content script into the current tab and then enables it
	 *
	 * @param {number} tabId	The tab id to load the addon into
	 */
	load:		function(tabId) {

		console.log('loading content script');

		// load the script
		chrome.tabs.executeScript(
			tabId,
			{
				file:	"content.js"
			},
			function() {

				console.log('content script for tab #' + tabId + ' has loaded');

				// save the tab loaded state and then load the addon
				PageRuler.enable(tabId);
			}
		);

	},

	/**
	 * Enables the addon for the tab
	 *
	 * @param {number} tabId	The tab id
	 */
	enable: function(tabId) {

		// send message to the tab telling it to activate
		chrome.tabs.sendMessage(
			tabId,
			{
				type: 'enable'
			},
			function(success) {

				console.log('enable message for tab #' + tabId + ' was sent');

				// log event
				PageRuler.Analytics.trackEvent('Action', 'Enable');

				// update browser action icon to active state
				chrome.browserAction.setIcon({
					"path":		PageRuler.image("browser_action_on.png"),
					"tabId":	tabId
				});
			}
		);

	},

	/**
	 * Disables the addon for the tab
	 *
	 * @param {number} tabId	The tab id
	 */
	disable: function(tabId) {

		// send message to the tab telling it to activate
		chrome.tabs.sendMessage(
			tabId,
			{
				type: 'disable'
			},
			function(success) {

				console.log('disable message for tab #' + tabId + ' was sent');

				// log event
				PageRuler.Analytics.trackEvent('Action', 'Disable');

				// update browser action icon to active state
				chrome.browserAction.setIcon({
					"path":		PageRuler.image("browser_action.png"),
					"tabId":	tabId
				});
			}
		);

	},

	/**
	 * Runs the browserAction
	 *
	 * @param tab
	 */
	browserAction:	function(tab) {

		// get the current tab id
		var tabId = tab.id;

		// construct arguments to send to the tab
		var args = "'action': 'loadtest'," +
					"'loaded': window.hasOwnProperty('__PageRuler')," +
					"'active': window.hasOwnProperty('__PageRuler') && window.__PageRuler.active";

		// get the tab to send a message back to the background script telling it of the addon state
		chrome.tabs.executeScript(tabId, {
			code:	"chrome.runtime.sendMessage({ " + args + " });"
		});

	}

};

/**
 * Listeners
 */

// browser action
chrome.browserAction.onClicked.addListener(PageRuler.browserAction);

// startup
chrome.runtime.onStartup.addListener(function() {
	console.log('onStartup');
	PageRuler.init();
});

// installation
chrome.runtime.onInstalled.addListener(function() {
	console.log('onInstalled');
	PageRuler.init();
});

// messages
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	// get tab id
	var tabId = sender.tab && sender.tab.id;

	console.group('message received from tab #' + tabId)
	console.log('message: ', message);
	console.log('sender: ', sender);

	switch (message.action) {

		// check whether the addon content script is loaded and it's active state
		case 'loadtest':

			// content script not yet loaded
			if (!message.loaded) {

				// load it
				PageRuler.load(tabId);

			}
			// content script is loaded
			else {

				// addon is active
				if (message.active) {

					// disable it
					PageRuler.disable(tabId);

				}
				// addon is inactive
				else {

					// enable it
					PageRuler.enable(tabId);

				}

			}

		break;

		// disable addon for the tab
		case 'disable':

			console.log('tear down');

			if (!!tabId) {
				PageRuler.unload(tabId);
			}

		break;

		// sets the ruler colour
		case 'setColor':

			console.log('saving color ' + message.color);

			PageRuler.Analytics.trackEvent('Settings', 'Color', message.color);

			chrome.storage.sync.set({
				'color':	message.color
			});

		break;

		// get the ruler colour
		case 'getColor':

			console.log('requesting color');

			chrome.storage.sync.get('color', function(items) {

				// get colour or default to blue
				var color = items.color || '#0080ff';

				console.log('color requested: ' + color);

				sendResponse(color);

			});

		break;

		// track an event
		case 'trackEvent':

			console.log('track event message received: ', message.args);

			PageRuler.Analytics.trackEvent.apply(PageRuler.Analytics, message.args);

			sendResponse();

		break;

		// track a pageview
		case 'trackPageview':

			console.log('track pageview message received: ', message.page);

			PageRuler.Analytics.trackPageview(message.page);

			sendResponse();

	}

	console.groupEnd();

	return true;

});