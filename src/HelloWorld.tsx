import { render, h } from 'preact';

function HelloWorld() {
	return <div>Hello World</div>;
}

export function renderApp(root: HTMLElement) {
	render(<HelloWorld />, root);
}