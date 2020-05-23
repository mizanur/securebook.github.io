import { h, ComponentChild } from 'preact';
import "@styles/BookLayout.scss";

function SecureBook({ leftPage, rightPage }: { leftPage: ComponentChild, rightPage: ComponentChild }) {
	return <div className="BookLayout">
		<div className="BookLayout__LeftPage">{ leftPage }</div>
		<div className="BookLayout__RightPage">{ rightPage }</div>
		<div className="BookLayout__BehindPageTop"></div>
		<div className="BookLayout__BehindPage"></div>
		<div className="BookLayout__Bookmark"></div>
		<div className="BookLayout__BookmarkBottomLeft"></div>
		<div className="BookLayout__BookmarkBottomRight"></div>
	</div>;
}

export default SecureBook;