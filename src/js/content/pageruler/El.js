
/**
 * Element control
 * Used to create and manage elements and listeners
 */

(function(pr) {

pr.El = {
	
	/**
	 * Array of all elements created by the addon
	 */
	elements:	[],
	
	/**
	 * Array of all listeners created by the addon
	 */
	listeners:	[],
	
	/**
	 * Creates an element, and creates a reference to it in the elements array
	 * 
	 * @param {String} tag			The type of element to create
	 * @param {Object} attrs		Key/value object to add as attributes to the element
	 * @params {Object} listeners	Listener type/callback object to apply to the element
	 * @returns HTMLElement
	 */
	createEl:	function(tag, attrs, listeners, text) {
		
		// initialise attributes
		attrs = attrs || {};
		
		// construct element id
		// no id attribute implies the root 'page-ruler' id	
		attrs.id = !!attrs.id && 'page-ruler-' + attrs.id || 'page-ruler';
		
		// create el
		var el = document.createElement(tag);
		
		// apply all attributes to the element
		for (var attr in attrs) {
			
			if (attrs.hasOwnProperty(attr)) {

				var attrVal = attrs[attr];
				
				// rename cls (class is a keyword so cannot be used directed)
				if (attr === 'cls') {
					attr = 'class';
				}

				// add id prefix to any 'for' properties
				if (attr === 'for') {
					attrVal = 'page-ruler-' + attrVal;
				}
				
				// set attribute
				el.setAttribute(attr, attrVal);
				
			}
			
		}

		// add listeners
		listeners = listeners || {};
		for (var type in listeners) {
			this.registerListener(el, type, listeners[type]);
		}

		// add text
		if (!!text) {
			el.innerText = text;
		}
		
		// add to elements array
		this.elements.push(el);
		
		// return element
		return el;
		
	},
	
	/**
	 * Appends an element to another element
	 *
	 * @param {HTMLElement} parent	The parent element to append to
	 * @param {Array} children		Array of html elements to append to the parent
	 */
	appendEl:	function(parent, children) {

		// make children an array, if not already one
		if (!(children instanceof Array)) {
			children = [children];
		}
		
		// loop through each child and add it to the parent
		for (var i=0; i<children.length; i++) {
			parent.appendChild(children[i]);
		}
		
	},
	
	/**
	 * Registers an event listener on an element, and creates a reference to it in the listeners array
	 * @param  {HTMLElement} el		The element to add the listener to
	 * @param  {String} type		The type of listener to add
	 * @param  {Function} func		The even listener function
	 * @return {void}
	 */
	registerListener:	function(el, type, func) {
		
		// add event listener
		el.addEventListener(type, func, false);
		
		// register reference
		this.listeners.push({
			el:		el,
			type:	type,
			func:	func
		});
		
	},
	
	/**
	 * Removes all event listeners that have been registered
	 */
	removeListeners:	function() {

		// while some listeners still exist
		while (this.listeners.length > 0) {
			
			// extract last listener
			var listener = this.listeners.pop();
			
			// unregister it
			listener.el.removeEventListener(listener.type, listener.func, false);

			// just to make sure
			listener = null;
			
		}
		
	},
	
	/**
	 * Removes all elements that have been registered
	 */
	removeElements:	function() {
		
		// while some elements still exist
		while (this.elements.length > 0) {
			
			// extract last element
			var el = this.elements.pop();
			
			// remove it from dom
			if (el instanceof HTMLElement) {
				
				el.parentNode.removeChild(el);
				
			}
			
			// just to make sure
			el = null;
			
		}

		// reset elements array
		this.elements = [];
		
	},
	
	/**
	 * Returns whether an element has a specific class
	 * @param  {HTMLElement} el		The element to test
	 * @param  {String} cls			The class to check
	 * @return {Boolean}
	 */
	hasClass: function(el, cls) {
		
		return el.classList.contains(cls);
		
	},
	
	/**
	 * Adds a class to an element
	 * @param  {HTMLElement} el		The element to add the class to
	 * @param  {String} cls			The class to add
	 */
	addClass: function(el, cls) {
		
		el.classList.add(cls);
		
	},
	
	/**
	 * Removes a class from an element
	 * @param  {HTMLElement} el		The element to remove the class from
	 * @param  {String} cls			The class to remove
	 */
	removeClass: function(el, cls) {
		
		el.classList.remove(cls);
		
	},
	
	/**
	 * Returns the left position of the element
	 * http://www.quirksmode.org/js/findpos.html
	 * @param {HTMLElement} el	The element to get the left position for
	 * @return {Number}
	 */	 
	getLeft: function(el) {
		
		var curLeft		= 0;
		var original	= el;
		
		do {
			// get border left width
			var borderLeft	= el === original ? 0 : parseInt(window.getComputedStyle(el, null).getPropertyValue('border-left-width'), 10);
			curLeft			+= el.offsetLeft + borderLeft;
		} while (el = el.offsetParent);
		
		return curLeft;
		
	},
	
	/**
	 * Returns the top position of the element
	 * http://www.quirksmode.org/js/findpos.html
	 * @param {HTMLElement} el	The element to get the top position for
	 * @return {Number}
	 */	 
	getTop: function(el) {
		
		var curTop		= 0;
		var original	= el;
		
		do {
			// get border top width
			var borderTop	= el === original ? 0 : parseInt(window.getComputedStyle(el, null).getPropertyValue('border-top-width'), 10);
			curTop			+= el.offsetTop + borderTop;
		} while (el = el.offsetParent);

		return curTop;
		
	},
	
	/**
	 * Returns a description of the element in the format tagName#id.class1.class2
	 * @param {HTMLElement} el	The element to get the description for
	 * @param {boolean} asParts	Whether to return the description in parts, instead of a string
	 * @return {String}
	 */
	getDescription:	function(el, asParts) {

		// if element does not have a tag name, abort
		if (!el.tagName) {
			throw 'tagName does not exist';
		}

		var parts = {
			'tag':	el.tagName.toLowerCase(),
			'id':	'',
			'cls':	''
		};

		// construct descriptor
		var desc = el.tagName.toLowerCase();
		parts.tag = desc;
		
		// add id, if exists
		if (!!el.id) {
			desc += '#' + el.id;
			parts.id = '#' + el.id;
		}
		
		// add classes, if any
		if (el.classList.length > 0) {
			desc += '.' + Array.prototype.slice.call(el.classList).join('.');
			parts.cls = '.' + Array.prototype.slice.call(el.classList).join('.');
		}
		
		// return full description
		return asParts && parts || desc;
		
	},
	
	/**
	 * Returns the parent element of an element
	 * @param  {HTMLElement} el		The element to get the parent of
	 * @return {HTMLElement}
	 */
	getParentNode: function(el) {
		
		return el.parentNode;
		
	},

	/**
	 * Returns whether the element is an illegal type which should be ignored
	 * @param {HTMLElement} el
	 * @returns {boolean}
	 */
	isIllegal: function(el) {

		// illegal element tags that will be ignored
		var illegalTags = ['head', 'script', 'noscript'];

		// element is illegal if it is a non element or an illegal element type
		return el.nodeType !== 1 ||
				illegalTags.indexOf(el.tagName.toLowerCase()) >= 0;

	},
	
	/**
	 * Returns the first element node child of an element (excluding some element types)
	 * @param  {HTMLElement} el		The element to get the first child of
	 * @return {HTMLElement|null}
	 */
	getChildNode: function(el) {
		
		// initialise child
		var childNode = null;
		
		// if element has children
		if (el.childNodes) {
			
			// get first child
			childNode = el.firstChild;
			
			// pass over any non element nodes or illegal types
			while (childNode && this.isIllegal(childNode)) {
				childNode = childNode.nextSibling;
			}
			
		}
		
		// if child node was found and is the <head> element
		// set childNode as the body instead
		if (childNode && childNode.tagName.toLowerCase() === 'head') {
			childNode = document.body;
		}
		
		// return child node
		return childNode;
		
	},
	
	/**
	 * Returns the previous sibling of an element
	 * @param  {HTMLElement} el		The element to get the previous sibling of
	 * @return {HTMLElement|null}
	 */
	getPreviousSibling: function(el) {
		
		// get the previous node
		var prevNode = el.previousElementSibling;

		// pass over any non element nodes or illegal types	
		while (prevNode && this.isIllegal(prevNode)) {
			prevNode = prevNode.previousElementSibling;
		}
		
		// return previous node
		return prevNode;
		
	},
	
	/**
	 * Returns the next sibling of an element
	 * @param  {HTMLElement} el		The element to get the next sibling of
	 * @return {HTMLElement|null}
	 */
	getNextSibling: function(el) {
		
		// get the previous node
		var nextNode = el.nextElementSibling;
		
		// pass over any non element nodes or illegal types	
		while (nextNode && this.isIllegal(nextNode)) {
			nextNode = nextNode.nextElementSibling;
		}
		
		// return next node
		return nextNode;
		
	},

	inElement: function(el, parent) {

		var inParent = false;

		var parentNode = el.parentNode;

		while (parentNode) {
			if (parentNode === parent) {
				inParent = true;
				break;
			}
			parentNode = parentNode.parentNode;
		}

		return inParent;

	}
	
};

})(__PageRuler);