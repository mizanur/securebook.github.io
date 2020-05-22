import "@styles/reset.scss";
import "@styles/fonts.scss";
import "@styles/main.scss";
import { renderApp } from '@view/renderApp';

function main() {
	const root = document.createElement('div');
	root.setAttribute('id', 'root');
	document.body.appendChild(root);
	renderApp(root);
}

main();