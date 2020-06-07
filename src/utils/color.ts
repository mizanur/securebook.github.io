export function isHexColorValid(hex: string) {
	return /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex);
}

export function getColorFromHex(hex: string): [number, number, number] {
	const rHex = hex.length === 3
		? `${hex[0]}${hex[0]}`
		: `${hex[0]}${hex[1]}`;
	const gHex = hex.length === 3
		? `${hex[1]}${hex[1]}`
		: `${hex[2]}${hex[3]}`;
	const bHex = hex.length === 3
		? `${hex[2]}${hex[2]}`
		: `${hex[4]}${hex[5]}`;
	return [parseInt(rHex, 16), parseInt(gHex, 16), parseInt(bHex, 16)];
}

export function getHexFromColor([r,g,b]: [number, number, number]): string {
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	const rHex = r > 15 ? r.toString(16) : `0${r.toString(16)}`;
	const gHex = g > 15 ? g.toString(16) : `0${g.toString(16)}`;
	const bHex = b > 15 ? b.toString(16) : `0${b.toString(16)}`;
	return `${rHex}${gHex}${bHex}`;
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
export function rgbToHsv([r, g, b]: [number, number, number]): [number, number, number] {
	r /= 255, g /= 255, b /= 255;

	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, v = max;

	const d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return [ h, s, v ];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export function hsvToRgb([h, s, v]: [number, number, number]): [number, number, number] {
	let r, g, b;

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}

	return [ r * 255, g * 255, b * 255 ];
}