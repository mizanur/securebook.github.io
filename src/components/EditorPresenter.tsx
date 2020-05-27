import { h } from 'preact';
import { EditorView } from "prosemirror-view";
import "@styles/EditorPresenter.scss";
import { useRef, useContext, useEffect } from "preact/hooks";
import { useEffectOnce } from '@view/useEffectOnce';
import { NoteContent } from '@interfaces/Notes';
import { connect } from '@view/connect';
import { StoreContext } from '@view/StoreContext';
import { EditorState, Transaction } from 'prosemirror-state';

function EditorPresenter({ contentId, content, onContentChange, disabled = false }: { contentId: any, content: NoteContent, disabled?: boolean, onContentChange: (textContent: string, content: NoteContent) => any }) {
	const { editor } = useContext(StoreContext);
	const element = useRef<HTMLDivElement>(null);
	const view = useRef<EditorView>(null);
	const state = useRef<EditorState>(null);
	function setStateFromProps() {
		const contentNode = document.createElement('span');
		contentNode.innerHTML = content.html;
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
				onContentChange(element.current.textContent || '', { html: div.innerHTML });
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
	return <div className={`EditorPresenter ${disabled ? 'EditorPresenter--disabled': ``}`} ref={element}></div>;
}

export default connect(EditorPresenter);