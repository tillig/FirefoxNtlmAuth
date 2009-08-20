/// <reference path="~/chrome/content/common.js" />
if (!com) var com = {};
if (!com.paraesthesia) com.paraesthesia = {};
if (!com.paraesthesia.ntlmauth) com.paraesthesia.ntlmauth = {};
if (!com.paraesthesia.ntlmauth.EditDialog) com.paraesthesia.ntlmauth.EditDialog = {};

if (!com.paraesthesia.ntlmauth.EditDialog.Listbox) com.paraesthesia.ntlmauth.EditDialog.Listbox =
{
	clear: function(lbox) {
		var currentCount = lbox.itemCount;
		for (var i = 0; i < currentCount; i++) {
			lbox.removeItemAt(0);
		}
	},

	contains: function(lbox, value) {
		for (var i = 0; i < lbox.itemCount; i++) {
			var listItem = lbox.getItemAtIndex(i);
			if (listItem.label.toLowerCase() == value.toLowerCase()) {
				return true;
			}
		}
		return false;
	},

	databind: function(lbox, data) {
		this.clear(lbox);
		for (var i = 0; i < data.length; i++) {
			lbox.appendItem(data[i]);
		}
	},

	removeSelectedItem: function(lbox) {
		lbox.removeItemAt(lbox.getIndexOfItem(lbox.selectedItem));
	},

	toArray: function(lbox) {
		var list = new Array(lbox.itemCount);
		for (var i = 0; i < lbox.itemCount; i++) {
			var listItem = lbox.getItemAtIndex(i);
			list[i] = listItem.label;
		}
		return list;
	}
};

if (!com.paraesthesia.ntlmauth.EditDialog.DialogController) com.paraesthesia.ntlmauth.EditDialog.DialogController =
{
	addButton: null,
	addSiteTextBox: null,
	removeButton: null,
	siteListBox: null,

	addSite: function() {
		var url = this.addSiteTextBox.value;
		if (!com.paraesthesia.ntlmauth.EditDialog.Listbox.contains(this.siteListBox, url)) {
			var newSiteList = com.paraesthesia.ntlmauth.EditDialog.Listbox.toArray(this.siteListBox);
			newSiteList[newSiteList.length] = url;
			com.paraesthesia.ntlmauth.Preferences.saveSiteList(newSiteList);
		}
		this.populateSiteList();
		this.addSiteTextBox.value = "";
		this.updateAddButtonDisabled(this.addSiteTextBox);
	},

	initialize: function() {
		this.addButton = document.getElementById("addButton");
		this.addSiteTextBox = document.getElementById("addSiteTextBox");
		this.removeButton = document.getElementById("removeButton");
		this.siteListBox = document.getElementById("siteListBox");

		this.addSiteTextBox.focus();
		this.populateSiteList();
		// TODO: Put the current web site in the textbox IF it's not already in the list.
		this.updateAddButtonDisabled(this.addSiteTextBox);

	},

	populateSiteList: function() {
		var list = com.paraesthesia.ntlmauth.Preferences.loadSiteList();
		com.paraesthesia.ntlmauth.EditDialog.Listbox.databind(this.siteListBox, list);
	},


	removeSite: function() {
		com.paraesthesia.ntlmauth.EditDialog.Listbox.removeSelectedItem(this.siteListBox);
		var newSiteList = com.paraesthesia.ntlmauth.EditDialog.Listbox.toArray(this.siteListBox);
		com.paraesthesia.ntlmauth.Preferences.saveSiteList(newSiteList);

		this.populateSiteList();
		this.updateRemoveButtonDisabled(this.siteListBox);
	},


	updateAddButtonDisabled: function(textbox) {
		var url = textbox.value;
		this.addButton.disabled = !com.paraesthesia.ntlmauth.String.isValidUrl(url);
	},

	updateFormFromSelection: function(listbox) {
		this.removeButton.disabled = (this.siteListBox.selectedItem == null);
	}
};
