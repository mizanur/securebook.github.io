import { EasingType } from "@interfaces/Easing";

export type EasingKeys = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' |
	'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' |
	'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint';

export const easing: { [k in EasingKeys]: EasingType } = {
	// no easing, no acceleration
	linear: p => p,
	// accelerating from zero velocity
	easeInQuad: p => p * p,
	// decelerating to zero velocity
	easeOutQuad: p => p * (2 - p),
	// acceleration until halfway, then deceleration
	easeInOutQuad: p => p < 0.5 ? 2 * p * p :  - 1 + (4 - 2 * p) * p,
	// accelerating from zero velocity 
	easeInCubic: p => p * p * p,
	// decelerating to zero velocity 
	easeOutCubic: p => (--p) * p * p + 1,
	// acceleration until halfway, then deceleration 
	easeInOutCubic: p => p < 0.5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1,
	// accelerating from zero velocity 
	easeInQuart: p => p * p * p * p,
	// decelerating to zero velocity 
	easeOutQuart: p => 1 - (--p) * p * p * p,
	// acceleration until halfway, then deceleration
	easeInOutQuart: p => p < 0.5 ? 8 * p * p * p * p : 1 - 8 * (--p) * p * p * p,
	// accelerating from zero velocity
	easeInQuint: p => p * p * p * p * p,
	// decelerating to zero velocity
	easeOutQuint: p => 1 + (--p) * p * p * p * p,
	// acceleration until halfway, then deceleration 
	easeInOutQuint: p => p < 0.5 ? 16 * p * p * p * p * p : 1 + 16 * (--p) * p * p * p * p
};