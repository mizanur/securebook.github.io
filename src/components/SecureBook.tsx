import { h, Fragment } from 'preact';
import { connect } from '@view/connect';
import "@styles/SecureBook.scss";
import Input from '@components/Input';
import { useState, useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';
import { filterNotesByTags } from '@utils/tags';
import { getValues } from '@utils/object';
import EditorPresenter from '@components/EditorPresenter';

function SecureBook() {
	const { password, notes } = useContext(StoreContext);
	const { passwordManager, noteManager } = useContext(ManagersContext);
	const [tagSearch, setTagSearch] = useState('');
	const trimmedTagSearch = tagSearch.trim();
	const list = getValues(notes.list);
	const isContentLoaded = notes.selected
		&& (notes.selected.content.status === 'loaded'
			|| notes.selected.content.status === 'loaded: not created');
	return <div className="SecureBook">
		<aside className="SecureBook__Sidebar">
			<article className="SecureBook__Section">
				<h1>Password</h1>
				<Input type="text" value={password.value} onChange={e => passwordManager.providePassword(e.currentTarget.value)} />
				<div>Status: {password.status}</div>
			</article>
			<article className="SecureBook__Section">
				<h1>Tag search</h1>
				<Input type="text" value={tagSearch} onInput={e => setTagSearch(e.currentTarget.value)} />
			</article>
			<div className="SecureBook__Section">Note status: { notes.status }</div>
			<div className="SecureBook__Section"><button onClick={() => noteManager.createNoteAndSelect()}>Add note</button></div>
			{
				(trimmedTagSearch
					? filterNotesByTags(list, trimmedTagSearch)
					: list)
				.map(note => (
					<article className={`SecureBook__Section ${notes.selectedId === note.id ? `SecureBook__NoteSelected` : ``}`}
						onClick={() => noteManager.selectNote(notes.selectedId !== note.id ? note.id : null)}
					>
						<h1 className="SecureBook__NoteName">{note.name}</h1>
						<div>ID: {note.id}</div>
						<div>Tags: {note.tags.join(' ')}</div>
						<div>Created time: {note.createdTime}</div>
						<div>Last updated time: {note.lastUpdatedTime}</div>
						<button onClick={() => noteManager.deleteNote(note.id)}>Delete note</button>
					</article>
				))
			}
		</aside>
		<main className="SecureBook__Main">
			{
				notes.selected
					? <Fragment>
						<div className="SecureBook__Editor">
							<EditorPresenter
								disabled={!isContentLoaded}
								contentId={isContentLoaded && notes.selected.id}
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
								Tags: <Input value={notes.selected.tags.join(' ')}
									onInput={e => noteManager.updateSelectedNoteTags(e.currentTarget.value.split(/\s+/))}
								/>
							</div>
						</div>
					</Fragment>
					: <div>Not selected</div>
			}
		</main>
	</div>;
}

export default connect(SecureBook);