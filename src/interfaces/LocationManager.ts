export interface LocationManager {
	push(url: string);
	replace(url: string);
	go(steps: number);
	goBack();
	goForward();
	redirect(url: string);
}