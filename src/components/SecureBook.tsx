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
import LoadingSpinner from '@components/LoadingSpinner';
import Tags from '@components/Tags';

const optionalSidebarScreenWidth = `1450px`;

function SecureBook() {
	const { notes, darkMode } = useContext(StoreContext);
	const { noteManager } = useContext(ManagersContext);
	const [tagSearch, setTagSearch] = useState<string[]>([]);
	const list = orderByUpdatedDate(getValues(notes.list));
	const isContentLoaded = notes.selected
		&& (notes.selected.content.status === 'loaded'
			|| notes.selected.content.status === 'loaded: not created');
	const isContentLoading = notes.selected
		&& (notes.selected.content.status === 'loading');
	const isEditorSpinnerShown = notes.selected
		&& (
			notes.selected.content.status === 'deleting' ||
			notes.selected.content.status === 'updating' ||
			notes.selected.content.status === 'creating'
		);
	const { contextMenuId, getTriggerProps, contextMenuProps } = useContextMenu();
	const focusedId = contextMenuId ?? notes.selectedId;
	const contentId = notes.selected && !isContentLoading && notes.selected.id;

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
						<Tags
							iconType="search"
							type="text"
							placeholder="Tag search"
							className="SecureBook__TagSearch"
							tags={tagSearch}
							onTagsChange={setTagSearch}
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
								: filterNotesByTags(list, tagSearch)
									.map(note => (
										<button
											key={note.id}
											className={
												`SecureBook__Section SecureBook__Note ${
													notes.selectedId === note.id ? `SecureBook__Note--selected` : ``
												} ${
													notes.dirty[note.id] ? `SecureBook__Note--dirty` : ``
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
										</button>
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
			} ${
				isEditorSpinnerShown
					? `SecureBook__Main--loading`
					: ``
			}`}
			onClickCapture={onMainClick}
		>
			{
				isEditorSpinnerShown &&
					<LoadingSpinner className="SecureBook__MainLoading" />
			}
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
					onClick={() => setSettingsOpen(!isSettingsOpen)}
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
							showTextLoading={!!isContentLoading}
							contentId={contentId}
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
						<Tags
							key={contentId}
							isNewAllowed
							isChangedOnInput
							className="SecureBook__AddTags"
							iconType="local_offer"
							placeholder="Add tags"
							direction={{ v: 'top', h: 'left' }}
							tags={notes.selected.tags}
							onTagsChange={tags => noteManager.updateSelectedNoteTags(tags)}
						/>
						{
							!!(notes.selectedId && notes.dirty[notes.selectedId]) && <button
								className="SecureBook__CancelButton"
								onClick={() => noteManager.cancelSelectedNoteChanges()}
							>
								<Icon type="cancel" /><span>Cancel</span>
							</button>
						}
					</div>
				</Fragment>
			}
		</main>
		<PasswordDialog />
	</div>;
}

export default connect(SecureBook);