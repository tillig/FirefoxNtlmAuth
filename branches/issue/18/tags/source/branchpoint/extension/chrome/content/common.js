if (!com) var com = {};
if (!com.paraesthesia) com.paraesthesia = {};
if (!com.paraesthesia.ntlmauth) com.paraesthesia.ntlmauth = {};

if (!com.paraesthesia.ntlmauth.String) com.paraesthesia.ntlmauth.String =
{
	isValidUrl: function (url) {
		// We want to allow versions with or without protocol,
		// just domains or domain suffixes, and non-FQDN server
		// names... so we can't really "validate" so much.
		var urlPattern = /^[^\s]+$/;
		return urlPattern.test(url);
	},

	trim: function(stringToTrim) {
		var re = /^\s*(.+?)\s*$/;
		return stringToTrim.replace(re, '$1');
	}
};

if (!com.paraesthesia.ntlmauth.Preferences) com.paraesthesia.ntlmauth.Preferences =
{
	delegationKey: "network.negotiate-auth.delegation-uris",
	ntlmAuthKey: "network.automatic-ntlm-auth.trusted-uris",
	trustedSiteKey: "network.negotiate-auth.trusted-uris",
	enableNonFqdnNtlmKey: "network.automatic-ntlm-auth.allow-non-fqdn",
	enableNonFqdnDelegationKey: "network.negotiate-auth.allow-non-fqdn",
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
			trimmedArray.sort();
		}
		return trimmedArray;
	},

	saveSiteList: function (siteList) {
		siteList.sort();
		var joinedList = siteList.join();
		this.preferenceService.setCharPref(this.delegationKey, joinedList);
		this.preferenceService.setCharPref(this.ntlmAuthKey, joinedList);
		this.preferenceService.setCharPref(this.trustedSiteKey, joinedList);
	},

	getNonFqdnEnabled: function () {
		var key1 = this.preferenceService.getBoolPref(this.enableNonFqdnNtlmKey);
		var key2 = this.preferenceService.getBoolPref(this.enableNonFqdnDelegationKey);
		return key1 && key2;
	},

	setNonFqdnEnabled: function (pref) {
		this.preferenceService.setBoolPref(this.enableNonFqdnNtlmKey, pref);
		this.preferenceService.setBoolPref(this.enableNonFqdnDelegationKey, pref);
	}
};
