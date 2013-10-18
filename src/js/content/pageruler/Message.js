/**
 * Message listener and processing
 */

(function(pr) {

// add message listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	switch (message.type) {

		// perform setup
		case 'enable':

			pr.enable();

		break;

		// perform teardown
		case 'disable':

			pr.disable();

		break;

	}

	// send response
	sendResponse({
		success: true
	});

});

})(__PageRuler);