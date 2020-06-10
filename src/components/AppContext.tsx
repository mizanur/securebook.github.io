import { h } from 'preact';
import { Component, Fragment } from "preact";

const contextRef = {
	current: null as any,
}

export class AppContextProvider extends Component {
	render() {
		contextRef.current = this.context;
		return null;
	}
}

export class AppContextConsumer extends Component {
	getChildContext() {
		return contextRef.current;
	}

	render() {
		return <Fragment>{this.props.children}</Fragment>;
	}
}