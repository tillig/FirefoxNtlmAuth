if (!com) var com = {};
if (!com.paraesthesia) com.paraesthesia = {};
if (!com.paraesthesia.ntlmauth) com.paraesthesia.ntlmauth = {};
if (!com.paraesthesia.ntlmauth.ToolsMenu) com.paraesthesia.ntlmauth.ToolsMenu =
{
	showEditorDialog: function() {
		window.open("chrome://ntlmauth/content/edit-dialog.xul", "ntlmauth-edit-dialog", "chrome,alwaysRaised=yes,centerscreen=yes,dependent=yes,modal=yes,dialog=yes,resizable=no");
	}
};
