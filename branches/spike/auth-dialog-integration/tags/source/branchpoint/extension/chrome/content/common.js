if(!com) var com = {};
if(!com.paraesthesia) com.paraesthesia = {};
if(!com.paraesthesia.ntlmauth) com.paraesthesia.ntlmauth = {};

if(!com.paraesthesia.ntlmauth.Logger) com.paraesthesia.ntlmauth.Logger =
{
	logger: Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService),
	write: function(msg)
	{
		this.logger.logStringMessage(msg);
	},
	
	dumpHierarchy: function(obj)
	{
		for (var i in obj)
		{
			this.write(i + " = " + obj[i]);
		}
	}
};

if(!com.paraesthesia.ntlmauth.String) com.paraesthesia.ntlmauth.String =
{
	getHostFromUrl: function(url)
	{
		var index = url.indexOf("://");
		if(index < 0)
		{
			return url;
		}
		var site = url.substring(index + 3);
		return site;
	},
	
	isValidUrl: function(url)
	{
		var urlPattern = /^(?:(?:ftp|https?):\/\/)[^\s]+$/;
		return urlPattern.test(url.toLowerCase());
	},

	trim: function(stringToTrim)
	{
		var str = stringToTrim.replace(/^\s\s*/, '');
		var ws = /\s/;
		var i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	},
		
	urlSort: function(a, b)
	{
		var siteA = com.paraesthesia.ntlmauth.String.getHostFromUrl(a);
		var siteB = com.paraesthesia.ntlmauth.String.getHostFromUrl(b);
		if(siteA < siteB)
		{
			return -1;
		}
		else if(siteA > siteB)
		{
			return 1;
		}
		return 0;
	}
};

if(!com.paraesthesia.ntlmauth.Preferences) com.paraesthesia.ntlmauth.Preferences =
{
	preferenceKey: "network.automatic-ntlm-auth.trusted-uris",
	preferenceService: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService),

	loadSiteList: function()
	{
		var prefString = this.preferenceService.getCharPref(this.preferenceKey);
		var prefArray = new Array();
		prefArray = prefString.split(",");
		for(var i = 0; i < prefArray.length; i++)
		{
			prefArray[i] = com.paraesthesia.ntlmauth.String.trim(prefArray[i]);
		}
		prefArray.sort(com.paraesthesia.ntlmauth.String.urlSort);
		return prefArray;
	},
	
	saveSiteList: function(siteList)
	{
		siteList.sort(com.paraesthesia.ntlmauth.String.urlSort);
		this.preferenceService.setCharPref(this.preferenceKey, siteList.join());
	}
};
