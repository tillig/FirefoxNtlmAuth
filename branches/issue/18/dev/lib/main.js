var data = require("sdk/self").data,
	_ = require("sdk/l10n").get,
	tabs = require("sdk/tabs"),
	prefs = require("sdk/preferences/service"),
	prefKeys = {
		delegation: "network.negotiate-auth.delegation-uris",
		ntlmAuth: "network.automatic-ntlm-auth.trusted-uris",
		trustedSite: "network.negotiate-auth.trusted-uris",
		enableNonFqdnNtlm: "network.automatic-ntlm-auth.allow-non-fqdn",
		enableNonFqdnDelegation: "network.negotiate-auth.allow-non-fqdn"
	};

var editdialog = require("sdk/panel").Panel({
	width: 540,
	height: 400,
	contentURL: data.url("editdialog.html"),
	contentScriptFile: [data.url("jquery-2.1.0.min.js"), data.url("bootstrap/js/bootstrap.min.js"), data.url("editdialog.js")]
});

// TODO: Add some sort of other button... maybe in the Security tab?
// TODO: Handle someone selecting one or more items from the list and removing the items.

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

// Maintain the current site list in memory because save/load
// of prefs runs async.
var currentSiteList = null;

function trim(stringToTrim) {
	if (stringToTrim === null)
	{
		return null;
	}

	return stringToTrim.replace(/^\s*(.+?)\s*$/, '$1');
}

function getSiteList() {
	// We assume all of the SPNEGO settings should be kept in sync.
	// https://developer.mozilla.org/en/Integrated_Authentication
	var prefString = prefs.get(prefKeys.ntlmAuth, ""),
		prefArray = new Array(),
		trimmedArray = new Array();

	if (prefString !== null && prefString.length > 0) {
		prefArray = prefString.split(",");
		for (var i = 0; i < prefArray.length; i++) {
			var url = trim(prefArray[i]);
			if (url !== null && url.length > 0) {
				trimmedArray.push(url);
			}
		}
		trimmedArray.sort();
	}

	return trimmedArray;
}

function setSiteList (siteList) {
	var joinedList = siteList.join();
	prefs.set(prefKeys.delegation, joinedList);
	prefs.set(prefKeys.ntlmAuth, joinedList);
	prefs.set(prefKeys.trustedSite, joinedList);
}

function getNonFqdnEnabled() {
	var key1 = prefs.get(prefKeys.enableNonFqdnNtlm, false),
		key2 = prefs.get(prefKeys.enableNonFqdnDelegation, false);
	return key1 && key2;
}

function setNonFqdnEnabled(pref) {
	prefs.set(prefKeys.enableNonFqdnNtlm, pref);
	prefs.set(prefKeys.enableNonFqdnDelegation, pref);
}

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

	currentSiteList = getSiteList();
	editdialog.port.emit("updatelist", currentSiteList);
	editdialog.port.emit("updatenonfqdn", getNonFqdnEnabled());
});

editdialog.on("hide", function () {
	editdialog.port.emit("hide");
});

editdialog.port.on("nonfqdn-change", function (enabled) {
	setNonFqdnEnabled(enabled);
});

editdialog.port.on("resize-to-content", function (dimensions) {
	editdialog.resize(dimensions.width, dimensions.height);
});

editdialog.port.on("site-added", function (text) {
	text = trim(text);
	if (text === null || text.length === 0) {
		return;
	}

	currentSiteList.push(text);
	currentSiteList.sort();
	setSiteList(currentSiteList);
	editdialog.port.emit("updatelist", currentSiteList);
});
