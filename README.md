# Integrated Authentication for Firefox

:warning: **Firefox Forcing Deprecation of This Plugin**

Firefox is updating its plugin model to WebExtensions [so you can no longer access application settings](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Comparison_with_the_Add-on_SDK#Settings). Given all this plugin does is modify app settings using a nicer UI, this effectively deprecates my plugin as soon as WebExtensions are the only plugins supported. This appears to be happening around the Firefox 52 / 53 timeframe. There's nothing I can do about it, so... sorry. It's been a good run.

---

Most people don't realize it, but Firefox will do NTLM (Windows pass-through) and SPNEGO (Kerberos, etc.) authentication just like Internet Explorer. Some people solve the issue by going around Firefox and hosting IE right in Firefox. The other way to do it is to keep Firefox as the rendering engine and tell Firefox it's OK to use Windows credentials to authenticate with a given site.

The problem is that managing the list of sites you allow Firefox to pass-through authenticate with is not straightforward and involves manually manipulating configuration settings.

This add-on makes it easier to manage this list, allowing you to stick with Firefox but still use integrated/pass-through authentication.

## Installing the Extension

You can install the extension through [the Firefox Add-On Gallery](https://addons.mozilla.org/en-US/firefox/addon/13816).

## Using the Extension

[The wiki has some extensive help docs explaining usage.](https://github.com/tillig/FirefoxNtlmAuth/wiki)

**Note this extension does not actually DO the authentication.** It just allows easier configuration of settings already present in Firefox. If you're having actual authentication trouble or want a new type of authentication supported, you need to request those features from the Mozilla team.

## Building and Running the Extension

The extension uses the Firefox Add-On SDK for build/execution. You can [get the SDK from the Mozilla site](https://developer.mozilla.org/en-US/Add-ons/SDK).

To start the SDK, run `C:\firefox-addon-sdk\bin\activate` - this sets up the environment. You then have some commands available:

`cfx run` - Launches Firefox with the extension loaded in a test profile.

`cfx xpi` - Packages the add-on into an XPI file for publication.

There are some convenience batch files (`start-addin.bat` and `build-addin.bat`) that do the SDK start/run all in one click.
