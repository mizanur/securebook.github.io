import { useRef } from "preact/hooks";

type TouchStartValue = {
	isStarted: boolean,
	timeout: number,
	x: number,
	y: number,
}

const touchMoveThreshold = 10; //px

export function useLongTap() {
	const touchStart = useRef<TouchStartValue>({
		isStarted: false,
		timeout: -1,
		x: 0,
		y: 0,
	});

	return function getLongTapProps({ time = 1000, onLongTap }: { time?: number, onLongTap: (e: TouchEvent) => any }) {
		let onTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 1) {
				touchStart.current.isStarted = true;
				touchStart.current.x = e.touches[0].clientX;
				touchStart.current.y = e.touches[0].clientY;
				touchStart.current.timeout = window.setTimeout(() => {
					touchStart.current.isStarted = false;
					onLongTap(e);
				}, time);
			}
		};

		let onTouchMove = (e: TouchEvent) => {
			if (
				touchStart.current.isStarted && (
					e.touches.length !== 1 ||
					Math.abs(e.touches[0].clientX - touchStart.current.x) > touchMoveThreshold ||
					Math.abs(e.touches[0].clientY - touchStart.current.y) > touchMoveThreshold
				)
			) {
				touchStart.current.isStarted = false;
				clearTimeout(touchStart.current.timeout);
			}
		};

		let onTouchEnd = (e: TouchEvent) => {
			if (touchStart.current.isStarted) {
				touchStart.current.isStarted = false;
				clearTimeout(touchStart.current.timeout);
			}
		};
		
		return {
			onTouchEnd,
			onTouchMove,
			onTouchStart,
		};
	};
}