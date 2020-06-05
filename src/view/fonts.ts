export const minEditorFontSize = 1;
export const defaultFontSize = 18;
export const maxEditorFontSize = 200;

export const fontTypeNames = {
	'sans-serif': 'Sans-serif',
	'serif': 'Serif',
	'monospace': 'Monospace',
	'cursive': 'Cursive',
};

export const defaultFontsLookup = {
	'default': 'Montserrat',

	'sans-serif': [
		'Montserrat',
		'Arial',
		'Helvetica',
		'Verdana',
		'Trebuchet MS',
		'Gill Sans',
		'Noto Sans',
		'Avantgarde',
		'TeX Gyre Adventor',
		'URW Gothic L',
		'Optima',
		'Arial Narrow',
	],
	
	'serif': [
		'Times',
		'Times New Roman',
		'Didot',
		'Georgia',
		'Palatino',
		'URW Palladio L',
		'Bookman',
		'URW Bookman L',
		'New Century Schoolbook',
		'TeX Gyre Schola',
		'American Typewriter',
	],
	
	'monospace': [
		'Andale Mono',
		'Courier New',
		'Courier',
		'FreeMono',
		'OCR A Std',
		'DejaVu Sans Mono',
	],
	
	'cursive': [
		'Comic Sans MS',
		'Comic Sans',
		'Apple Chancery',
		'Bradley Hand',
		'Brush Script MT',
		'Brush Script Std',
		'Snell Roundhand',
		'URW Chancery L',
	],
};

export const defaultFonts = [
	...defaultFontsLookup["sans-serif"],
	...defaultFontsLookup.serif,
	...defaultFontsLookup.monospace,
	...defaultFontsLookup.cursive,
];

function getFontTypeLookup(): { [k: string]: string } {
	const result: { [k: string]: string } = {};
	
	for (const fontType in fontTypeNames) {
		for (let i = 0; i < defaultFontsLookup[fontType].length; i++) {
			result[defaultFontsLookup[fontType][i]] = fontType;
		}
	}

	return result;
}

export const fontTypeLookup = getFontTypeLookup();

// To figure out which fonts are available or not, we compare the sizes of fonts
// to sizes of fallback fonts. We rely on the low likelihood of widths + heights matching.

export function getAvailableFonts(): { [k: string]: boolean } {
	let child: HTMLElement;

	const parent = document.createElement('div');
	parent.style.fontSize = '24px';
	parent.style.visibility = 'hidden';
	document.body.appendChild(parent);

	// Reason for first appending, then reading data is because browsers
	// will only trigger relayout once, rather than each time element is appended,
	// which is much faster

	const fontTypeElements: { [k: string]: HTMLElement } = {};
	for (const fontType in fontTypeNames) {
		child = document.createElement('div');
		child.style.position = 'absolute';
		child.style.whiteSpace = 'nowrap';
		child.style.fontFamily = fontType;
		child.appendChild(document.createTextNode('The quick brown fox jumps over the lazy dog'));
		parent.appendChild(child);
		fontTypeElements[fontType] = child;
	}

	const fontElements: { [k: string]: HTMLElement } = {};
	for (let i = 0; i < defaultFonts.length; i++) {
		const font = defaultFonts[i];
		child = document.createElement('div');
		child.style.position = 'absolute';
		child.style.whiteSpace = 'nowrap';
		child.style.fontFamily = `"${font}",${fontTypeLookup[font]}`;
		child.appendChild(document.createTextNode('The quick brown fox jumps over the lazy dog'));
		parent.appendChild(child);
		fontElements[font] = child;
	}

	const fontTypeSizes: { [k: string]: { w: number, h: number } } = {};
	for (const fontType in fontTypeElements) {
		const rect = fontTypeElements[fontType].getBoundingClientRect();
		fontTypeSizes[fontType] = { w: rect.width, h: rect.height };
	}

	const fontTypeDetected: { [k: string]: boolean } = {};
	const result: { [k: string]: boolean } = {};
	for (const font in fontElements) {
		const type = fontTypeLookup[font];
		const rect = fontElements[font].getBoundingClientRect();
		const fontTypeSize = fontTypeSizes[type];
		const isFallingBackToType = rect.width === fontTypeSize.w && rect.height === fontTypeSize.h;
		result[font] = !isFallingBackToType || !fontTypeDetected[type];
		if (isFallingBackToType) {
			fontTypeDetected[type] = true;
		}
	}

	document.body.removeChild(parent);
	return result;
}