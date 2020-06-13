import { h } from 'preact';
import { Note } from '@interfaces/Notes';
import { useContext } from 'preact/hooks';
import { ManagersContext } from '@view/ManagersContext';
import ThemeBorder from '@components/ThemeBorder';
import Icon from '@components/Icon';
import { getFormattedDateTime } from '@utils/time';
import ContextMenu from '@components/ContextMenu';
import { DropDown, DropDownItem } from './DropDown';
import { useContextMenu } from '@view/useContextMenu';
import "@styles/NoteItem.scss";

function NoteItem(
	{ note, isDirty, selectedId, getTriggerProps, setSidebarOpen, focusedId, contextMenuId, contextMenuProps }:
	{
		note: Note,
		isDirty: boolean,
		selectedId: string | null,
		focusedId: string | null,
		setSidebarOpen: (isOpen: boolean) => void,
	}
	& ReturnType<typeof useContextMenu>
) {
	const { noteManager } = useContext(ManagersContext);
	const tags = note.tags.filter(tag => (tag.length > 0));
	return (
		<button
			key={note.id}
			className={
				`NoteItem ${
					selectedId === note.id ? `NoteItem--selected` : ``
				} ${
					isDirty ? `NoteItem--dirty` : ``
				}`
			}
			onClick={() => {
				if (selectedId !== note.id) {
					noteManager.selectNote(note.id);
				}
				setSidebarOpen(false);
			}}
			{...getTriggerProps(note.id)}
		>
			{focusedId === note.id && <ThemeBorder widths={{ left: 4 }} />}
			<h1 className="NoteItem__NoteName" title={note.name}>{!note.name ? <em>Unnamed note</em> : note.name}</h1>
			{tags.length > 0 &&
				<div className="NoteItem__Tags" title={note.tags.join(' ')}>
					<Icon type="local_offer" /> {note.tags.join(' ')}
				</div>}
			<div className="NoteItem__DateTime" title={
				"Last edited: " + getFormattedDateTime(note.lastUpdatedTime, true) + "\n" +
				"Created: " + getFormattedDateTime(note.createdTime, true)}>
				<Icon type="edit" /> {getFormattedDateTime(note.lastUpdatedTime)}</div>
			{contextMenuId === note.id &&
				<ContextMenu {...contextMenuProps}>
					<DropDown>
						<DropDownItem
							iconType="delete"
							label="Delete note"
							onClick={() => noteManager.deleteNote(note.id)}
						/>
					</DropDown>
				</ContextMenu>}
		</button>
	)
}

export default NoteItem;