(function($) {
	"use strict";

	var addSiteTextBox = document.getElementById("addSiteTextBox"),
		enableNonFqdnCheckbox = document.getElementById("enableNonFqdn"),
		siteListBox = document.getElementById("siteListBox");

	addSiteTextBox.addEventListener('keyup', function onkeyup(event) {
		if (event.keyCode === 13) {
			var text = addSiteTextBox.value.replace(/(\r\n|\n|\r)/gm, "");
			addSiteTextBox.value = '';
			addSiteTextBox.focus();
			self.port.emit("site-added", text);
		}
	}, false);

	enableNonFqdnCheckbox.addEventListener('change', function onchange(event) {
		self.port.emit("nonfqdn-change", enableNonFqdnCheckbox.checked);
	}, false);

	siteListBox.addEventListener('keyup', function onkeyup(event) {
		if (event.keyCode === 46) {
			var removed = [],
				i = 0;

			for (i = 0; i < siteListBox.length; i++)
			{
				if(siteListBox[i].selected)
				{
					removed.push(siteListBox[i].value);
				}
			}

			self.port.emit("site-removed", removed);
		}
	}, false);

	function resize()
	{
		var dimensions = { "width": $(document).width(), "height": $(document).height() };
		self.port.emit("resize-to-content", dimensions);
	}

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
		resize();
	});

	self.port.on("hide", function onHide() {
		addSiteTextBox.value = '';
	});

	self.port.on("updatelist", function onUpdateList(siteList) {
		var $slb = $(siteListBox);
		$slb.empty();
		$.each(siteList, function (index, value) {
			$slb.append($("<option></option>").attr("value", value).text(value));
		});
		resize();
	});

	self.port.on("updatenonfqdn", function onUpdateNonFqdn(enabled) {
		$("#enableNonFqdn").prop('checked', enabled);
	});
}(jQuery));