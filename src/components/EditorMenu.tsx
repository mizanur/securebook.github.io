import { h } from 'preact';
import "@styles/EditorMenu.scss";
import Icon from '@components/Icon';
import { connect } from '@view/connect';
import { useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { unwrap } from '@utils/wrap';

function EditorMenu() {
	const { editor } = useContext(StoreContext);
	const menu = unwrap(editor.menu);
	
	if (!menu) {
		return null;
	}

	return <div className='EditorMenu' onMouseDown={e => e.preventDefault()}>
		<button
			style={{
				background: menu.state.strong.isStrong ? '#555' : 'inherit',
			}}
			onClick={menu.actions.strong.toggleStrong}
		>
			<Icon type="format_bold" />
		</button>
		<button><Icon type="format_italic" /></button>
		<button><Icon type="format_underlined" /></button>
		<button><Icon type="format_list_bulleted" /></button>
		<button><Icon type="format_list_numbered" /></button>
	</div>
}

export default connect(EditorMenu);