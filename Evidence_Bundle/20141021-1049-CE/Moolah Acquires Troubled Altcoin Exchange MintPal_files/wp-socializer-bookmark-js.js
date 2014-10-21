/*
 * Copyright 2012 Aakash Chakravarthy - www.aakashweb.com
 * Created for WP Socializer - Wordpress Plugin
*/

function addBookmark(e) {
	var ua = navigator.userAgent.toLowerCase();
	var isMac = (ua.indexOf('mac') != -1), str = '';
	e.preventDefault();
	if(ua.indexOf('konqueror') != -1){
		str = 'CTRL + B'; // Konqueror
	}else{
		str = (isMac ? 'Command/Cmd' : 'CTRL') + ' + D';
	}
	alert('Press ' + str + ' to bookmark this page');
}