(function($) {
	"use strict";

	var addSiteTextBox = document.getElementById("addSiteTextBox");
	addSiteTextBox.addEventListener('keyup', function onkeyup(event) {
		if (event.keyCode == 13) {
			// TODO: Why is this only getting fired ONE TIME? The focus doesn't get set on the second entry. It isn't the jQuery wrapper or use strict.
			// TODO: Why does pressing ENTER with a URL in the box result in a navigation attempt?
			var text = addSiteTextBox.value.replace(/(\r\n|\n|\r)/gm, "");
			addSiteTextBox.value = '';
			addSiteTextBox.focus();
			self.port.emit("site-added", text);
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
		addSiteTextBox.value = data.activeurl;
		addSiteTextBox.focus();
	});

	self.port.on("hide", function onHide() {
		addSiteTextBox.value = '';
	});
}(jQuery));