import { render } from '@components/App';

function main() {
	const root = document.createElement('div');
	root.setAttribute('id', 'root');
	document.body.appendChild(root);
	render(root);
}

main();