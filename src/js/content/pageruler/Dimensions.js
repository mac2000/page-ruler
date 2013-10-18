/**
 * Page Dimensions
 */

(function(pr) {

pr.Dimensions = {

	/**
	 * Minimum left value the ruler can take
	 * @type Number
	 */
	pageLeft:	0,

	/**
	 * Maximum right value the ruler can take
	 * @type Number
	 */
	pageRight:	document.body.scrollWidth,

	/**
	 * Minimum top value the ruler can take
	 * @type Number
	 */
	pageTop:	0,

	/**
	 * Maximum bottom value the ruler can take
	 * @type Number
	 */
	pageBottom:	document.body.scrollHeight,

	/**
	 * Array of callbacks to apply when the dimensions are updated
	 */
	updateCallbacks:	[],

	/**
	 * Adds an callback function to the callbacks array
	 * @param {function} callback
	 */
	addUpdateCallback:	function(callback) {

		this.updateCallbacks.push(callback);

	},

	/**
	 * Updates the allowable page dimensions and applies all resize callbacks
	 */
	update:			function() {

		// update pageRight and pageBottom values
		this.pageRight	= document.body.scrollWidth;
		this.pageBottom	= document.body.scrollHeight;

		// loop through all callbacks
		for (var i=0,ilen=this.updateCallbacks.length; i<ilen; i++) {

			// apply callback, passing the new pageRight and pageBottom values as parameters
			this.updateCallbacks[i](this.pageRight, this.pageBottom);

		}

	},

	/**
	 * Removes all update callbacks
	 */
	removeUpdateCallbacks: function() {

		// loop through each callback
		for (var i=0,ilen=this.updateCallbacks.length; i<ilen; i++) {

			// null it
			this.updateCallbacks[i] = null;

		}

		// reset array
		this.updateCallbacks = [];

	}

};

})(__PageRuler);