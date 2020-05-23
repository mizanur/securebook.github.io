import { h, ComponentChild } from 'preact';
import "@styles/BookLayout.scss";
import { connect } from '@view/connect';

function SecureBook({ leftPage, rightPage }: { leftPage: ComponentChild, rightPage: ComponentChild }) {
	return <div className="BookLayout">
		<aside className="BookLayout__LeftPage">{ leftPage }</aside>
		<main className="BookLayout__RightPage">{ rightPage }</main>
	</div>;
}

export default connect(SecureBook);