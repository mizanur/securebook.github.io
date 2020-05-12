import { renderApp } from './HelloWorld';

function main() {
	const root = document.createElement('div');
	root.setAttribute('id', 'root');
	document.body.appendChild(root);
	renderApp(root);
}

main();