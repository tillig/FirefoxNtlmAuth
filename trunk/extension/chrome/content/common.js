if (!com) var com = {};
if (!com.paraesthesia) com.paraesthesia = {};
if (!com.paraesthesia.ntlmauth) com.paraesthesia.ntlmauth = {};

if (!com.paraesthesia.ntlmauth.String) com.paraesthesia.ntlmauth.String =
{
	getHostFromUrl: function(url) {
		var index = url.indexOf("://");
		if (index < 0) {
			return url;
		}
		var site = url.substring(index + 3);
		return site;
	},

	isValidUrl: function(url) {
		var urlPattern = /^(?:(?:ftp|https?):\/\/)[^\s]+$/;
		return urlPattern.test(url.toLowerCase());
	},

	trim: function(stringToTrim) {
		var str = stringToTrim.replace(/^\s\s*/, '');
		var ws = /\s/;
		var i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	},

	urlSort: function(a, b) {
		var siteA = com.paraesthesia.ntlmauth.String.getHostFromUrl(a);
		var siteB = com.paraesthesia.ntlmauth.String.getHostFromUrl(b);
		if (siteA < siteB) {
			return -1;
		}
		else if (siteA > siteB) {
			return 1;
		}
		return 0;
	}
};

if (!com.paraesthesia.ntlmauth.Preferences) com.paraesthesia.ntlmauth.Preferences =
{
	delegationKey: "network.negotiate-auth.delegation-uris",
	ntlmAuthKey: "network.automatic-ntlm-auth.trusted-uris",
	trustedSiteKey: "network.negotiate-auth.trusted-uris",
	preferenceService: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService),

	loadSiteList: function () {
		// We assume all of the SPNEGO settings should be kept in sync.
		// https://developer.mozilla.org/en/Integrated_Authentication
		var prefString = this.preferenceService.getCharPref(this.ntlmAuthKey);
		var trimmedArray = new Array();
		if (prefString != null && prefString.length > 0) {
			var prefArray = new Array();
			prefArray = prefString.split(",");
			for (var i = 0; i < prefArray.length; i++) {
				var url = com.paraesthesia.ntlmauth.String.trim(prefArray[i]);
				if (url != null && url.length > 0) {
					trimmedArray.push(url);
				}
			}
			trimmedArray.sort(com.paraesthesia.ntlmauth.String.urlSort);
		}
		return trimmedArray;
	},

	saveSiteList: function (siteList) {
		siteList.sort(com.paraesthesia.ntlmauth.String.urlSort);
		var joinedList = siteList.join();
		this.preferenceService.setCharPref(this.delegationKey, joinedList);
		this.preferenceService.setCharPref(this.ntlmAuthKey, joinedList);
		this.preferenceService.setCharPref(this.trustedSiteKey, joinedList);
	}
};
