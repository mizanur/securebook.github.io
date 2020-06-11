import { h, Fragment } from 'preact';
import { connect } from '@view/connect';
import "@styles/SecureBook.scss";
import Input from '@components/Input';
import { useState, useContext, useRef, useEffect } from 'preact/hooks';
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
import { useEffectOnce } from '@view/useEffectOnce';
import Checkbox from '@components/Checkbox';
import Donate from '@components/Donate';

const optionalSidebarScreenWidth = `1450px`;

function SecureBook() {
	const { notes, darkMode } = useContext(StoreContext);
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

	const mql = window.matchMedia(`(max-width: ${optionalSidebarScreenWidth})`);
	const [isOptionalSidebar, setOptionalSidebar] = useState(mql.matches);
	const [isSidebarOpen, setSidebarOpen] = useState(true);

	useEffectOnce(() => {
		const resetOptionalSidebar = () => setOptionalSidebar(mql.matches);

		mql.addListener(resetOptionalSidebar);

		return () => {
			mql.removeListener(resetOptionalSidebar);
		}
	});

	const isNoteSelected = !!notes.selected?.id;
	useEffect(
		() => {
			if (isNoteSelected && isSidebarOpen) {
				setSidebarOpen(false);
			}
		},
		[isNoteSelected]
	);

	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const settingsRef = useRef<HTMLButtonElement>(null);

	const onMainClick = (e: MouseEvent) => {
		if (isOptionalSidebar && isSidebarOpen) {
			e.preventDefault();
			e.stopPropagation();
			setSidebarOpen(false);
		}
	};

	const donateFormRef = useRef<HTMLFormElement>(null);

	return <div className={`SecureBook ${darkMode.isDarkMode ? `dark-mode` : ``}`}>
		{
			(!isOptionalSidebar || isSidebarOpen) &&
				<aside className="SecureBook__Sidebar">
					<article className="SecureBook__SidebarTop">
						<button
							title="Add note"
							onClick={() => {
								noteManager.createNoteAndSelect();
								setSidebarOpen(false);
							}}
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
					</article>
					<section className="SecureBook__Notes">
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
										onClick={() => {
											if (notes.selectedId !== note.id) {
												noteManager.selectNote(note.id);
											}
											setSidebarOpen(false);
										}}
										{...getTriggerProps(note.id)}
									>
										{focusedId === note.id && <ThemeBorder widths={{ left: 4 }} />}
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
													<DropDownItem
														iconType="delete"
														label="Delete note"
														onClick={() => noteManager.deleteNote(note.id)}
													/>
												</DropDown>
											</ContextMenu>}
									</article>
								))
						}
					</section>
				</aside>
		}
		<main
			className={`SecureBook__Main ${
				isOptionalSidebar && isSidebarOpen
					? `SecureBook__Main--under-sidebar`
					: ``
			}`}
			onClickCapture={onMainClick}
		>
			<div
				className={`SecureBook__MainTop ${
					isOptionalSidebar && isSidebarOpen
						? `SecureBook__MainTop--under-sidebar`
						: ``
				}`}
				onClickCapture={onMainClick}
			>
				{
					isOptionalSidebar &&
						<button
							className="SecureBook__OpenMenu"
							onClick={() => setSidebarOpen(true)}
						>
							<Icon type="notes" />
						</button>
				}
				<EditorMenu className="SecureBook__Menu" />
				<button
					ref={settingsRef}
					className="SecureBook__Settings"
					onClick={() => setSettingsOpen(true)}
				>
					<Icon type="more_vert" />
				</button>
				{
					isSettingsOpen && <ContextMenu
							relativeRef={settingsRef}
							onClose={() => setSettingsOpen(false)}
						>
							<DropDown>
								<DropDownItem
									labelProps={{ className: "SecureBook__DarkModeChk" }}
									onClick={() => { darkMode.isDarkMode = !darkMode.isDarkMode; }}
								>
									<Checkbox isChecked={darkMode.isDarkMode} className="SecureBook__SettingsIcon" />
									<span>Dark mode</span>
								</DropDownItem>
								<DropDownItem onClick={() => donateFormRef.current.submit()}>
									<Donate formRef={donateFormRef}>
										<span className="SecureBook__SettingsIcon">❤️</span>
										<span>Donate</span>
									</Donate>
								</DropDownItem>
								<DropDownItem
									isLink
									iconType="github"
									href="https://github.com/guitarino/securebook"
									label="View on Github"
								/>
								<DropDownItem
									isLink
									iconType="bug_report"
									href="https://github.com/guitarino/securebook/issues"
									label="Report an issue"
								/>
							</DropDown>
						</ContextMenu>
				}
			</div>
			{
				!!notes.selected && <Fragment>
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
						<button
							className="SecureBook__SaveButton"
							onClick={() => noteManager.saveSelectedNote()}
						>
							<Icon type="save" />
							{
								notes.selected.content.status === 'creating' ||
								notes.selected.content.status === 'updating'
									? <span>Saving...</span> :
								notes.selected.content.status === 'loading'
									? <span>Loading...</span>
									: <span>Save</span>
							}
						</button>
						<Input
							className="SecureBook__AddTags"
							iconType="local_offer"
							placeholder="Add tags"
							value={notes.selected.tags.join(' ')}
							onInput={e => noteManager.updateSelectedNoteTags(
								e.currentTarget.value.length
									? e.currentTarget.value.split(/\s+/)
									: [])}
						/>
					</div>
				</Fragment>
			}
		</main>
		<PasswordDialog />
	</div>;
}

export default connect(SecureBook);