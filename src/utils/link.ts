export function isLinkExternal(href) {
	return /^https?\:\/\//.test(href);
}