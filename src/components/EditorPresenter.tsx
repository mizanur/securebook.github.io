import { h, Fragment } from 'preact';
import { EditorView } from "prosemirror-view";
import "@styles/EditorPresenter.scss";
import { useRef, useContext, useEffect } from "preact/hooks";
import { useEffectOnce } from '@view/useEffectOnce';
import { NoteContent } from '@interfaces/Notes';
import { connect } from '@view/connect';
import { StoreContext } from '@view/StoreContext';
import { EditorState, Transaction } from 'prosemirror-state';
import EditorMenu from '@components/EditorMenu';
import TextLoading from '@components/TextLoading';

function EditorPresenter({ contentId, content, onContentChange, disabled = false, showLoading = false, }: { contentId: any, content: NoteContent, disabled?: boolean, showLoading?: boolean, onContentChange: (textContent: string, content: NoteContent) => any }) {
	const { editor } = useContext(StoreContext);
	const element = useRef<HTMLDivElement>(null);
	const view = useRef<EditorView>(null);
	const state = useRef<EditorState>(null);
	const contentRef = useRef<NoteContent>(null);
	contentRef.current = content;
	function setStateFromProps() {
		const contentNode = document.createElement('span');
		contentNode.innerHTML = contentRef.current.html;
		state.current = EditorState.create({
			schema: editor.editorSchema.schema,
			doc: editor.domParser.parse(contentNode),
			plugins: editor.editorPluginsManager.getPlugins(editor.editorSchema.schema),
		});
	}
	useEffectOnce(() => {
		setStateFromProps();
		view.current = new EditorView(element.current, {
			state: state.current,
			dispatchTransaction: (transaction: Transaction) => {
				const div = document.createElement('div');
				state.current = state.current.apply(transaction);
				view.current.updateState(state.current);
				div.appendChild(editor.domSerializer.serializeFragment(state.current.doc.content));
				if (contentRef.current.html !== div.innerHTML) {
					onContentChange(element.current.innerText || '', { html: div.innerHTML });
				}
			},
		});
		return () => {
			view.current.destroy();
		};
	});
	useEffect(() => {
		setStateFromProps();
		view.current.updateState(state.current);
	}, [contentId]);
	return <div className={`EditorPresenter ${disabled ? 'EditorPresenter--disabled': ``}`} >
		<EditorMenu />
		{showLoading && <TextLoading className="EditorPresenter__TextLoading" />}
		<div className="EditorPresenter__Content" ref={element}></div>
	</div>;
}

export default connect(EditorPresenter);