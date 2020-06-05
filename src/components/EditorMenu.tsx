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
	const headingRef = useRef<HTMLButtonElement>(null);
	const [isLinkEditorOpen, setLinkEditorOpen] = useState(false);
	const [isHeadingEditorOpen, setHeadingEditorOpen] = useState(false);
	const useFocusProps = useFocusOnMount();
	
	if (!menu) {
		return null;
	}

	return <div className='EditorMenu' onMouseDown={e => e.preventDefault()}>
		<button
			disabled={!menu.state.heading.canToggle}
			className={`EditorMenu__Button ${
				menu.state.heading.canToggle && menu.state.heading.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => setHeadingEditorOpen(true)}
			title="Heading"
			ref={headingRef}
		>
			<Icon type="title" />
		</button>
		{
			menu.state.heading.canToggle && isHeadingEditorOpen && <ContextMenu
				onClose={() => setHeadingEditorOpen(false)}
				relativeRef={headingRef}
			>
				<DropDown className="EditorMenu__HeadingEditor">
					{
						menu.state.heading.isCurrent &&
							<DropDownItem label="Remove heading" iconType="format_clear" onClick={menu.actions.heading.remove} />
					}
					<DropDownItem
						label={`Heading level 1`}
						onClick={() => menu.actions.heading.setLevel(1)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 1}
					>
						<h1>Heading level 1</h1>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 2`}
						onClick={() => menu.actions.heading.setLevel(2)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 2}
					>
						<h2>Heading level 2</h2>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 3`}
						onClick={() => menu.actions.heading.setLevel(3)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 3}
					>
						<h3>Heading level 3</h3>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 4`}
						onClick={() => menu.actions.heading.setLevel(4)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 4}
					>
						<h4>Heading level 4</h4>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 5`}
						onClick={() => menu.actions.heading.setLevel(5)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 5}
					>
						<h5>Heading level 5</h5>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 6`}
						onClick={() => menu.actions.heading.setLevel(6)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 6}
					>
						<h6>Heading level 6</h6>
					</DropDownItem>
				</DropDown>
			</ContextMenu>
		}
		<button
			disabled={!menu.state.strong.canToggle}
			className={`EditorMenu__Button ${
				menu.state.strong.canToggle && menu.state.strong.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.strong.toggle}
			title="Bold"
		>
			<Icon type="format_bold" />
		</button>
		<button
			disabled={!menu.state.em.canToggle}
			className={`EditorMenu__Button ${
				menu.state.em.canToggle && menu.state.em.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.em.toggle}
			title="Italics"
		>
			<Icon type="format_italic" />
		</button>
		<button
			disabled={!menu.state.underline.canToggle}
			className={`EditorMenu__Button ${
				menu.state.underline.canToggle && menu.state.underline.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.underline.toggle}
			title="Underlined"
		>
			<Icon type="format_underlined" />
		</button>
		<button
			disabled={!menu.state.strikethrough.canToggle}
			className={`EditorMenu__Button ${
				menu.state.strikethrough.canToggle && menu.state.strikethrough.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.strikethrough.toggle}
			title="Strikethrough"
		>
			<Icon type="format_strikethrough" />
		</button>
		<button
			ref={linkRef}
			disabled={!menu.state.link.canToggle}
			className={`EditorMenu__Button ${
				menu.state.link.canToggle && menu.state.link.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => setLinkEditorOpen(!isLinkEditorOpen)}
			title="Link"
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
			disabled={!menu.state.code.canToggle}
			className={`EditorMenu__Button ${
				menu.state.code.canToggle && menu.state.code.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.code.toggle}
			title="Inline code"
		>
			<Icon type="code" />
		</button>
		<button
			disabled={!menu.state.codeBlock.canToggle}
			className={`EditorMenu__Button EditorMenu__CodeBlock ${
				menu.state.codeBlock.canToggle && menu.state.codeBlock.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.codeBlock.toggle}
			title="Code block"
		>
			<Icon className="EditorMenu__CodeBlock-Code" type="code" />
			<Icon className="EditorMenu__CodeBlock-Block" type="short_text" />
		</button>
		<button
			disabled={!menu.state.blockquote.canToggle}
			className={`EditorMenu__Button ${
				menu.state.blockquote.canToggle && menu.state.blockquote.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.blockquote.toggle}
			title="Quote block"
		>
			<Icon type="format_quote" />
		</button>
		<button
			className="EditorMenu__Button"
			onClick={menu.actions.horizontalRule.add}
			title="Horizontal rule"
		>
			<Icon type="horizontal_rule" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'left' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'left',
			})}
			title="Align: Left"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_left" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'center' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'center',
			})}
			title="Align: Center"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_center" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'justify' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'justify',
			})}
			title="Align: Justify"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_justify" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'right' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'right',
			})}
			title="Align: Right"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_right" />
		</button>
		<button
			disabled={!menu.state.bulletList.canToggle}
			className={`EditorMenu__Button ${
				menu.state.bulletList.canToggle && menu.state.bulletList.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.bulletList.toggle}
			title="Bulleted List"
		>
			<Icon type="format_list_bulleted" />
		</button>
		<button
			disabled={!menu.state.orderedList.canToggle}
			className={`EditorMenu__Button ${
				menu.state.orderedList.canToggle && menu.state.orderedList.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.orderedList.toggle}
			title="Numbered List"
		>
			<Icon type="format_list_numbered" />
		</button>
		<button
			disabled={!menu.state.todoList.canToggle}
			className={`EditorMenu__Button ${
				menu.state.todoList.canToggle && menu.state.todoList.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.todoList.toggle}
			title="Todo List"
		>
			<Icon type="list_alt" />
		</button>
	</div>
}

export default connect(EditorMenu);