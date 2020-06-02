export interface MenuActions {
	strong: {
		toggle: () => void,
	},
	em: {
		toggle: () => void,
	},
	code: {
		toggle: () => void,
	},
	underline: {
		toggle: () => void,
	},
	strikethrough: {
		toggle: () => void,
	},
	link: {
		createUpdate: (attrs: { href: string, title: string }) => void,
		remove: () => void,
	},
	blockquote: {
		toggle: () => void,
	},
	codeBlock: {
		toggle: () => void,
	},
}