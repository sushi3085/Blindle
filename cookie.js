var Cookies = {
	init: function () {
		var allCookies = document.cookie.split('; ');
		for (var i=0;i<allCookies.length;i++) {
			var cookiePair = allCookies[i].split('=');
			this[cookiePair[0]] = cookiePair[1];
		}
	},
	create: function (name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
		this[name] = value;
	},
	erase: function (name) {
		this.create(name,'',-1);
		this[name] = undefined;
	}
};
Cookies.init();

var Preferences = {
	init: function () {
		if (!Cookies.sitePrefs) return;
		sitePrefs = Cookies.sitePrefs.split(',,');
		for (var i=0;i<sitePrefs.length;i++) {
			var oneSitePref = sitePrefs[i].split(':');
			this[oneSitePref[0]] = oneSitePref[1];
		}	
	}
};
Preferences.init();