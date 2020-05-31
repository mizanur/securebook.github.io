import { h } from 'preact';
import "@styles/EditorMenu.scss";
import Icon from '@components/Icon';

function EditorMenu() {
	return <div className='EditorMenu'>
		<button><Icon type="format_bold" /></button>
		<button><Icon type="format_italic" /></button>
		<button><Icon type="format_underlined" /></button>
		<button><Icon type="format_list_bulleted" /></button>
		<button><Icon type="format_list_numbered" /></button>
	</div>
}

export default EditorMenu;