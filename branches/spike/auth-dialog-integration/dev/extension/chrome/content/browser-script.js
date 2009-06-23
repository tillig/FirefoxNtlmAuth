var ntlmwatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].createInstance(Components.interfaces.nsIWindowWatcher);

var ntlmdialogupdater =
{
	xul_ns: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	
	updateCommonDialog: function(commonDialogDocument)
	{
		var button = this.createButton(commonDialogDocument);
		com.paraesthesia.ntlmauth.Logger.write("Created button.");
		var container = this.findButtonContainer(commonDialogDocument);
		if(container == null)
		{
			return;
		}
		com.paraesthesia.ntlmauth.Logger.write("Found container.");
		container.appendChild(button);
		com.paraesthesia.ntlmauth.Logger.write("Appended button.");
	},
	
	createButton: function(commonDialogDocument)
	{
		var button = commonDialogDocument.createElementNS(this.xul_ns, "button");
		// TODO: These entities aren't localized. Fix that.
		button.setAttribute("id", "ntlmButton2");
		button.setAttribute("label", "&amp;ntlmbutton.text;");
		button.setAttribute("accesskey", "&amp;ntlmbutton.accesskey;");
		// TODO: This isn't picking up the command from the overlay. Fix that or otherwise register the onclick handler.
		button.setAttribute("command", "cmd_useNtlmAuth");
		return button;
	},
	
	findButtonContainer: function(commonDialogDocument)
	{
		// This creates a row and puts it under everything... but above the OK/Cancel buttons.
		// Even if you add to the doc end, the OK/Cancel buttons still end up at the bottom.
		// TODO: Figure out how to put it BELOW the OK/Cancel buttons.
		var container = commonDialogDocument.getElementById("loginContainer").parentNode;
		return container;
	}
}

var ntlmobserver =
{
	observe: function(domWindow, topic, data)
	{
		if (topic == "domwindowopened")
		{
			domWindow.addEventListener("load", this.locateCommonDialog, true);
		}
	},
	
	locateCommonDialog: function(evt)
	{
		if(!evt || !evt.currentTarget)
		{
			return;
		}
		var commonDialogDocument = evt.currentTarget.document;
		var commonDialog = commonDialogDocument.getElementById("commonDialog");
		if(!commonDialog)
		{
			return;
		}
		com.paraesthesia.ntlmauth.Logger.write("OPENED AUTH PROMPT!");
		// TODO: Only add the button if the request allowed NTLM auth.
		ntlmdialogupdater.updateCommonDialog(commonDialogDocument);
	},
	
}
ntlmwatcher.registerNotification(ntlmobserver);
