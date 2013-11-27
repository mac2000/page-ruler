/**
 * Mouse utilities
 */

(function(pr) {

pr.Mouse = {

	/**
	 * Returns the x and y position of the mouse
	 *
	 * @param {Event} e		Mouse event object
	 * @return {Object}
	 */
	getXY:	function(e, noOffset) {

        // get page x and y
        var x = e.pageX;
        var y = e.pageY;

		// if applying offset
        if (!noOffset) {

			var toolbarHeight = pr.elements.toolbar.height;

			// also reduce by element toolbar height if enabled
			if (pr.elements.toolbar.elementMode) {
				toolbarHeight += pr.elements.toolbar.elementToolbar.height;
			}

			var bodyOffset = document.body.getBoundingClientRect().top;

			// reduce y by toolbar height
            y -= bodyOffset;

        }
		
		return {
			x:	x,
			y:	y
		};
		
	},	
	
	/**
	 * Returns the x position of the mouse
	 *
	 * @param {Event} e		Mouse event object
	 * @return {Object}
	 */
	getX:	function(e) {
		return this.getXY(e).x;
	},	
	
	/**
	 * Returns the y position of the mouse
	 *
	 * @param {Event} e		Mouse event object
	 * @return {Object}
	 */
	getY:	function(e, noOffset) {
		return this.getXY(e, noOffset).y;
	},
	
	/**
	 * Returns the x and y position of the mouse relative to the current top left corner
	 *
	 * @param {Event} e		Mouse event object
	 * @return {Object}
	 */
	getClientXY:	function(e, noOffset) {

        // get client x and y
        var x = e.clientX;
        var y = e.clientY;

        // if applying offset
        if (!noOffset) {

			// reduce y by toolbar height
            y -= pr.elements.toolbar.height;

			// also reduce by element toolbar height if enabled
			if (pr.elements.toolbar.elementMode) {
				y-= pr.elements.toolbar.elementToolbar.height;
			}

        }
		
		return {
			x:	x,
			y:	y
		};
		
	},	
	
	/**
	 * Returns the x position of the mouse relative to the current top left corner
	 *
	 * @param {Event} e		Mouse event object
	 * @return {Object}
	 */
	getClientX:	function(e) {
		return this.getClientXY(e).x;
	},
	
	
	/**
	 * Returns the y position of the mouse relative to the current top left corner
	 *
	 * @param {Event} e		Mouse event object
	 * @return {Object}
	 */
	getClientY:	function(e, noOffset) {
		return this.getClientXY(e, noOffset).y;
	}

};

})(__PageRuler);