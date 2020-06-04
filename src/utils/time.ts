export function getTimeInMS() {
	return +new Date();
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function getFormattedDateTime(timeInMS: number, isFull: boolean = false): string {
	const date = new Date(timeInMS);
	const curDate = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const time = `${withAppendedZeros(hours)}:${withAppendedZeros(minutes)}`
	if (!isFull && curDate.getFullYear() === year) {
		if (curDate.getMonth() === month && curDate.getDate() === day) {
			return time;
		}
		return `${months[month]} ${day}, ${time}`;
	}
	return `${months[month]} ${day}, ${year}, ${time}`;
}

function withAppendedZeros(num: number): string {
	return num >= 10 ? `${num}` : `0${num}`;
}

export function debounced<T>(fun: ((a: T) => any), time: number) {
	let isScheduled: boolean;
	let currentArg: T;
	let timeoutId: number;
	const clear = () => {
		isScheduled = false;
		currentArg = null as any;
		timeoutId = 0;
	};
	const perform = () => {
		fun(currentArg);
		clear();
	};
	return {
		schedule(arg: T) {
			if (isScheduled) {
				window.clearTimeout(timeoutId);
			}
			else {
				isScheduled = true;
			}
			currentArg = arg;
			timeoutId = window.setTimeout(perform, time);
		},
		perform() {
			if (isScheduled) {
				window.clearTimeout(timeoutId);
				perform();
			}
		},
		cancel() {
			if (isScheduled) {
				window.clearTimeout(timeoutId);
				clear();
			}
		},
	}
}