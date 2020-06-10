export function isLinkExternal(href) {
	return /^[a-zA-Z0-9]+?\:\/\//.test(href);
}