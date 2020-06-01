import { h, Fragment } from 'preact';
import "@styles/EditorMenu.scss";
import Icon from '@components/Icon';
import { connect } from '@view/connect';
import { useContext, useRef, useState } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { unwrap } from '@utils/wrap';
import ContextMenu from '@components/ContextMenu';
import { DropDown, DropDownItem } from '@components/DropDown';
import Input from '@components/Input';
import { useFocusOnMount } from '@view/useFocusOnMount';

function EditorMenu() {
	const { editor } = useContext(StoreContext);
	const menu = unwrap(editor.menu);
	const linkRef = useRef<HTMLButtonElement>(null);
	const [isLinkEditorOpen, setLinkEditorOpen] = useState(false);
	const useFocusProps = useFocusOnMount();
	
	if (!menu) {
		return null;
	}

	return <div className='EditorMenu' onMouseDown={e => e.preventDefault()}>
		<button
			className={`EditorMenu__Button ${menu.state.strong.isCurrent ? `EditorMenu__Button--active`: ``}`}
			onClick={menu.actions.strong.toggle}
		>
			<Icon type="format_bold" />
		</button>
		<button
			className={`EditorMenu__Button ${menu.state.em.isCurrent ? `EditorMenu__Button--active`: ``}`}
			onClick={menu.actions.em.toggle}
		>
			<Icon type="format_italic" />
		</button>
		<button
			className={`EditorMenu__Button ${menu.state.underline.isCurrent ? `EditorMenu__Button--active`: ``}`}
			onClick={menu.actions.underline.toggle}
		>
			<Icon type="format_underlined" />
		</button>
		<button
			className={`EditorMenu__Button ${menu.state.strikethrough.isCurrent ? `EditorMenu__Button--active`: ``}`}
			onClick={menu.actions.strikethrough.toggle}
		>
			<Icon type="format_strikethrough" />
		</button>
		<button
			ref={linkRef}
			className={`EditorMenu__Button ${menu.state.link.isCurrent ? `EditorMenu__Button--active`: ``}`}
			onClick={() => setLinkEditorOpen(!isLinkEditorOpen)}
		>
			<Icon type="link" />
		</button>
		{
			isLinkEditorOpen && <ContextMenu
				onClose={() => setLinkEditorOpen(false)}
				relativeRef={linkRef}
			>
				<DropDown>
					{
						!menu.state.link.isSelected
							? <DropDownItem className="EditorMenu__LinkEditorUnselected">
								Select text to make a link
							</DropDownItem>
							: <Fragment>
								<DropDownItem>
									<Input
										iconType="link"
										placeholder="Link"
										value={menu.state.link.attrs.href}
										onInput={e => menu.actions.link.createUpdate({
											href: e.currentTarget.value,
											title: menu.state.link.attrs.title,
										})}
										{...useFocusProps}
									/>
								</DropDownItem>
								<DropDownItem>
									<Input
										iconType="title"
										placeholder="Title (optional)"
										value={menu.state.link.attrs.title}
										onInput={e => menu.actions.link.createUpdate({
											href: menu.state.link.attrs.href,
											title: e.currentTarget.value,
										})}
									/>
								</DropDownItem>
								{
									menu.state.link.isCurrent &&
										<DropDownItem
											iconType="delete"
											label="Remove link"
											onClick={menu.actions.link.remove}
										/>
								}
							</Fragment>
					}
				</DropDown>
			</ContextMenu>
		}
		<button
			className={`EditorMenu__Button ${menu.state.code.isCurrent ? `EditorMenu__Button--active`: ``}`}
			onClick={menu.actions.code.toggle}
		>
			<Icon type="code" />
		</button>
		<button><Icon type="format_list_bulleted" /></button>
		<button><Icon type="format_list_numbered" /></button>
	</div>
}

export default connect(EditorMenu);