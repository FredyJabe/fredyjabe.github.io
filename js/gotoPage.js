function openInNewTab(url) {
	window.open(url, '_blank').focus();
}

function goToPage(url) {
	window.open(decodeURIComponent(url) + '.html', '_self').focus();
}

function goBack() {
	window.open('../blog.php', '_self').focus();
}
