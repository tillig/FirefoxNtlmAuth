var data = require("sdk/self").data;
var _ = require("sdk/l10n").get;
var tabs = require("sdk/tabs");

var editdialog = require("sdk/panel").Panel({
	width: 540,
	height: 400,
	contentURL: data.url("editdialog.html"),
	contentScriptFile: [data.url("jquery-2.1.0.min.js"), data.url("bootstrap/js/bootstrap.min.js"), data.url("editdialog.js")]
});

// TODO: Add some sort of other button... maybe in the Security tab?

var menuitem = require("menuitems").Menuitem({
	id: "menu_ntlmauthToolsPopup",
	menuid: "menu_ToolsPopup",
	label: _("toolsmenutext"),
	onCommand: function () {
		editdialog.show();
	},
	insertbefore: "devToolsSeparator",
	"accesskey": _("toolsmenuaccesskey")
});

// Pass the "show" event to the dialog for initialization.
editdialog.on("show", function () {
	var activeurl = "";
	if (tabs.activeTab.url.indexOf("about:") < 0) {
		activeurl = tabs.activeTab.url;
	}

	var strings = {
		activeurl: activeurl,
		editdialogaddhelpcontent: _("editdialogaddhelpcontent"),
		editdialogaddhelptitle: _("editdialogaddhelptitle"),
		editdialoglisthelpcontent: _("editdialoglisthelpcontent"),
		editdialoglisthelptitle: _("editdialoglisthelptitle")
	};
	editdialog.port.emit("show", strings);

	// TODO: Read the list of settings and update the list box.
	//editdialog.port.emit("updatelist", ["http://one", "http://two"]);
});

editdialog.on("hide", function () {
	editdialog.port.emit("hide");
});

editdialog.port.on("resize-to-content", function (dimensions) {
	editdialog.resize(dimensions.width, dimensions.height);
});

editdialog.port.on("site-added", function (text) {
	// TODO: Add the item to the list of prefs.
	// TODO: Re-sort and send in the list of sites.
	editdialog.port.emit("updatelist", [text]);
});

// TODO: Handle someone selecting one or more items from the list and removing the items.