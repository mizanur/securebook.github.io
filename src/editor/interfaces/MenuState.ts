export interface MenuState {
	strong: {
		isCurrent: boolean,
	},
	em: {
		isCurrent: boolean,
	},
	code: {
		isCurrent: boolean,
	},
	underline: {
		isCurrent: boolean,
	},
	strikethrough: {
		isCurrent: boolean,
	},
	link: {
		isCurrent: boolean,
		isSelected: boolean,
		attrs: {
			href: string,
			title: string,
		},
	},
}