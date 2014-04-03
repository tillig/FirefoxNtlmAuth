var data = require("sdk/self").data;
var _ = require("sdk/l10n").get;

var editdialog = require("sdk/panel").Panel({
  width: 378,
  height: 320,
  contentURL: data.url("editdialog.html"),
  contentScriptFile: [data.url("jquery-2.1.0.min.js"), data.url("bootstrap/js/bootstrap.min.js"), data.url("editdialog.js")]
});

// TODO: Add some sort of other button... maybe in the Security tab?

var menuitem = require("menuitems").Menuitem({
  id: "menu_ntlmauthToolsPopup",
  menuid: "menu_ToolsPopup",
  label: _("toolsmenutext"),
  onCommand: function() {
    editdialog.show();
  },
  insertbefore: "devToolsSeparator",
  "accesskey": _("toolsmenuaccesskey")
});

// Pass the "show" event to the dialog for initialization.
editdialog.on("show", function() {
  editdialog.port.emit("show");
});

// DEMO STUFF...
editdialog.port.on("text-entered", function (text) {
  console.log(text);
  editdialog.hide();
});