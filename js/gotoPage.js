function openInNewTab(url) {
	window.open(url, '_blank').focus();
}

function goToPage(url) {
	if (url == 'main') window.open(decodeURIComponent(url) + '.php', '_self').focus();
	else window.open(decodeURIComponent(url) + '.html', '_self').focus();
}

function goBack() {
	window.open('../blog.php', '_self').focus();
}