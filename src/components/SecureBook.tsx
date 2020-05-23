import { h } from 'preact';
import { connect } from '@view/connect';
import BookLayout from '@components/BookLayout';

function SecureBook() {
	return <BookLayout
		leftPage={<span>Left page</span>}
		rightPage={<span>Right page</span>}
	/>;
}

export default connect(SecureBook);