export function createDarkMode() {
	return {
		isDarkMode: !!window.localStorage.getItem('darkMode'),
		
		onDarkModeChange() {
			if (this.isDarkMode) {
				window.localStorage.setItem('darkMode', 'true');
			}
			else {
				window.localStorage.removeItem('darkMode');
			}
		},
	}
}