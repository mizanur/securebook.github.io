import { h } from 'preact';
import "@styles/EditorMenu.scss";
import Icon from '@components/Icon';

function EditorMenu() {
	return <div className='EditorMenu'>
		<Icon type="format_bold" />
		<Icon type="format_italic" />
		<Icon type="format_list_bulleted" />
		<Icon type="format_list_numbered" />
	</div>
}

export default EditorMenu;