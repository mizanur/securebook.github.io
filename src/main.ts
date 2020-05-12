import { renderApp } from './HelloWorld';
import { connect } from 'typeconnect';

class B {
	a = 100;
	b = 200;
}

class A {
	b: B;
	a = 300;

	constructor(b: B) {
		this.b = b;
	}

	get c() {
		return this.b.a + this.b.b + this.a;
	}

	d() {
		console.log(`Result: ${this.c}`);
	}
}

function main() {
	const root = document.createElement('div');
	root.setAttribute('id', 'root');
	document.body.appendChild(root);
	renderApp(root);

	const BConn = connect(B);
	const AConn = connect(A);

	const b = new BConn;
	const a = new AConn(b);
	console.log('---');
	b.a = 200;
	console.log('---');
	b.a = 250;
	console.log('---');
	b.b = 300;
	console.log('---');
	a.a = 400;
	console.log('---');
}

main();