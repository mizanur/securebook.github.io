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