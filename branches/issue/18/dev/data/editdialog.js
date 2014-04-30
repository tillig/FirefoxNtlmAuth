(function($) {
	"use strict";

	var addSiteTextBox = document.getElementById("addSiteTextBox");
	addSiteTextBox.addEventListener('keyup', function onkeyup(event) {
		if (event.keyCode == 13) {
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

		// Resize to fit the contents. There's an odd margin at the bottom I
		// can't figure out and you can't debug panel HTML yet, so... compensate.
		var dimensions = { "width": $(document).width(), "height": $(document).height() - 11 };
		console.log(dimensions);
		self.port.emit("resize-to-content", dimensions);
	});

	self.port.on("hide", function onHide() {
		addSiteTextBox.value = '';
	});

	self.port.on("updatelist", function onUpdateList(siteList) {
		console.log(siteList);
		var $slb = $("#siteListBox");
		$slb.empty();
		$.each(siteList, function (index, value) {
			$slb.append($("<option></option>").attr("value", value).text(value));
		});
	});
}(jQuery));