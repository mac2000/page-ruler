/**
 * Utility and helper functions
 */

(function(pr) {

pr.Util = {

	/**
	 * Returns a number, with px appended to the end
	 * @param  {Number} num		The number to append px to
	 * @return {String}
	 */
	px:	function(num) {
		return num + 'px';
	},

	/**
	 * Returns some text in the current locale
	 * @param {String} message	The message to get
	 * @param {String} options	The option to apply to the string
	 * @returns {String}
	 */
	locale: function(message, options) {

		// get message
		var text = chrome.i18n.getMessage(message);

		switch (options) {

			// convert message to lower case
			case 'lowercase':
				text = text.toLocaleLowerCase();
				break;

			// convert message to upper case
			case 'uppercase':
				text = text.toLocaleUpperCase();
				break;
		}

		return text;

	},

	/**
	 * Converts a hex color value to rgb
	 * @see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#answer-5624139
	 * @param {String} hex	The hex value string
	 * @returns {String}
	 */
	hexToRGB: function(hex, alpha) {

		// default alpha to 1 (no transparancy)
		alpha = alpha || 1;

		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		// get r, g and b values
		var r = parseInt(result[1], 16);
		var g = parseInt(result[2], 16);
		var b = parseInt(result[3], 16);

		// return rgba string
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';

	}

};

})(__PageRuler);