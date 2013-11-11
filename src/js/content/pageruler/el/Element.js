
/**
 * Tracked element
 */

(function(pr) {

pr.el.Element = pr.cls(
	function(dom) {

		// reference dom object
		this.dom = dom;

		// set up initial urler config
		var config = {
			width:	pr.El.getWidth(dom),
			height:	pr.El.getHeight(dom),
			top:	pr.El.getTop(dom),
			left:	pr.El.getLeft(dom)
		};

		// set the ruler on top of the element
		pr.elements.ruler.reset(config);

	},
	{

		/**
		 * The dom element
		 * @type {HTMLElement}
		 */
		dom:	null
	}
);

})(__PageRuler);