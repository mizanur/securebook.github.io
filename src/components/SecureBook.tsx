import { h, Fragment } from 'preact';
import { connect } from '@view/connect';
import "@styles/SecureBook.scss";
import BasicInput from '@components/BasicInput';
import Input from '@components/Input';
import { useState, useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';
import { filterNotesByTags } from '@utils/tags';
import { getValues } from '@utils/object';
import EditorPresenter from '@components/EditorPresenter';
import Icon from '@components/Icon';
import { getFormattedDateTime } from '@utils/time';
import ContextMenu from '@components/ContextMenu';
import { useContextMenu } from '@view/useContextMenu';
import { DropDown, DropDownItem } from '@components/DropDown';
import ThemeBorder from '@components/ThemeBorder';
import PasswordDialog from '@components/PasswordDialog';
import { orderByUpdatedDate } from '@utils/notes';
import TextLoading from '@components/TextLoading';
import EditorMenu from '@components/EditorMenu';

function SecureBook() {
	const { notes } = useContext(StoreContext);
	const { noteManager } = useContext(ManagersContext);
	const [tagSearch, setTagSearch] = useState('');
	const trimmedTagSearch = tagSearch.trim();
	const list = orderByUpdatedDate(getValues(notes.list));
	const isContentLoaded = notes.selected
		&& (notes.selected.content.status === 'loaded'
			|| notes.selected.content.status === 'loaded: not created');
	const isContentLoading = notes.selected
		&& (notes.selected.content.status === 'loading');
	const { contextMenuId, getTriggerProps, contextMenuProps } = useContextMenu();
	const focusedId = contextMenuId ?? notes.selectedId;
	return <div className="SecureBook">
		<div className="SecureBook__TopBar">
			<div className="SecureBook__SidebarTop">
				<button
					title="Add note"
					onClick={() => noteManager.createNoteAndSelect()}
				>
					<Icon type="add_box" />
				</button>
				<Input
					iconType="search"
					type="text"
					value={tagSearch}
					onInput={e => setTagSearch(e.currentTarget.value)}
					placeholder="Tag search"
					className="SecureBook__TagSearch"
				/>
			</div>
			<div className="SecureBook__MainTop">
				<EditorMenu />
			</div>
		</div>
		<aside className="SecureBook__Sidebar">
			<article className="SecureBook__Notes">
				{
					notes.status === 'loading'
						? <Fragment>
							<TextLoading className="SecureBook__Loading" />
							<TextLoading className="SecureBook__Loading" />
							<TextLoading className="SecureBook__Loading" />
						</Fragment>
						: (trimmedTagSearch
							? filterNotesByTags(list, trimmedTagSearch)
							: list)
						.map(note => (
							<article
								key={note.id}
								className={
									`SecureBook__Section SecureBook__Note ${
										notes.selectedId === note.id ? `SecureBook__Note--selected` : ``
									}`
								}
								onClick={() => noteManager.selectNote(notes.selectedId !== note.id ? note.id : null)}
								{...getTriggerProps(note.id)}
							>
								{notes.selectedId === note.id && <div className="SecureBook__NoteSelected"></div>}
								{focusedId === note.id && <ThemeBorder className="SecureBook__NoteThemeBorder" widths={{ left: 4 }} />}
								<h1 className="SecureBook__NoteName" title={note.name}>{!note.name ? <em>Unnamed note</em> : note.name}</h1>
								{note.tags.length > 0 &&
									<div className="SecureBook__Tags" title={note.tags.join(' ')}>
										<Icon type="local_offer" /> {note.tags.join(' ')}
									</div>}
								<div className="SecureBook__DateTime" title={
									"Last edited: " + getFormattedDateTime(note.lastUpdatedTime, true) + "\n" +
									"Created: " + getFormattedDateTime(note.createdTime, true)}>
									<Icon type="edit" /> {getFormattedDateTime(note.lastUpdatedTime)}</div>
								{contextMenuId === note.id &&
									<ContextMenu {...contextMenuProps}>
										<DropDown>
											<DropDownItem type="delete" label="Delete note" onClick={() => noteManager.deleteNote(note.id)} />
										</DropDown>
									</ContextMenu>}
							</article>
						))
				}
			</article>
		</aside>
		<main className="SecureBook__Main">
			{
				notes.selected
					? <Fragment>
						<div className="SecureBook__Editor">
							<EditorPresenter
								disabled={!isContentLoaded}
								showLoading={!!isContentLoading}
								contentId={!isContentLoading && notes.selected.id}
								content={notes.selected.content.value || { html: '' }}
								onContentChange={(text, content) => {
									noteManager.updateSelectedNoteContent(text, content);
								}}
							/>
						</div>
						<div className="SecureBook__BottomBar">
							<button onClick={() => noteManager.saveSelectedNote()}>Save note</button>
							<div>Status: {notes.selected.content.status}</div>
							<div>
								Tags: <BasicInput value={notes.selected.tags.join(' ')}
									onInput={e => noteManager.updateSelectedNoteTags(
										e.currentTarget.value.length
											? e.currentTarget.value.split(/\s+/)
											: [])}
								/>
							</div>
						</div>
					</Fragment>
					: <div>Not selected</div>
			}
			<PasswordDialog />
		</main>
	</div>;
}

export default connect(SecureBook);