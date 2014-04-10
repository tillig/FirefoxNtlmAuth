(function($) {
	"use strict";

	// When the user hits return, send the "text-entered"
	// message to main.js.
	// The message payload is the contents of the edit box.
	var addSiteTextBox = document.getElementById("addSiteTextBox");
	addSiteTextBox.addEventListener('keyup', function onkeyup(event) {
	  if (event.keyCode == 13) {
	    // Remove the newline.
	    text = addSiteTextBox.value.replace(/(\r\n|\n|\r)/gm,"");
	    self.port.emit("text-entered", text);
	    addSiteTextBox.value = '';
	    addSiteTextBox.focus();
	  }
	}, false);

	self.port.on("show", function onShow(data) {
		// Localize help text and enable popovers for help.
		$("#addHelp")
			.prop("title", data.editdialogaddhelptitle)
			.attr("data-content", data.editdialogaddhelpcontent);
		$("#listHelp")
			.prop("title", data.editdialoglisthelptitle)
			.attr("data-content", data.editdialoglisthelpcontent);
		$('.help').popover();

		// Set focus so people can start typing URLs.
		addSiteTextBox.focus();
	});
}(jQuery));