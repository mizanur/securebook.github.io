export function getInterpolation(p: number, v0: number, v1: number): number {
	return v0 * (1 - p) + v1 * p;
}

export function getInterpolationWithInertia(p: number, v0: number, v1: number, i0: number, t: number): number {
	return v0 * (1 - p) + v1 * p + i0 * t * (1 - p);
}

export function getInertia(v1: number, v0: number, t1: number, t0: number): number {
	return (v1 - v0) / (t1 - t0);
}