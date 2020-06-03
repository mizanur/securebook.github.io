import { h } from 'preact';
import { EditorView } from "prosemirror-view";
import "@styles/EditorPresenter.scss";
import { useRef, useContext, useEffect } from "preact/hooks";
import { useEffectOnce } from '@view/useEffectOnce';
import { NoteContent } from '@interfaces/Notes';
import { connect } from '@view/connect';
import { StoreContext } from '@view/StoreContext';
import { EditorState, Transaction } from 'prosemirror-state';
import TextLoading from '@components/TextLoading';
import { useState } from '@view/useState';
import { wrap } from '@utils/wrap';
import { Wrapped } from '@interfaces/Wrapped';

function EditorPresenter({ contentId, content, onContentChange, disabled = false, showLoading = false, }: { contentId: any, content: NoteContent, disabled?: boolean, showLoading?: boolean, onContentChange: (textContent: string, content: NoteContent) => any }) {
	const { editor } = useContext(StoreContext);
	const element = useRef<HTMLDivElement>(null);
	const view = useRef<EditorView>(null);
	const state: Wrapped<EditorState> = useState(() => wrap(null as unknown as EditorState));
	const contentRef = useRef<NoteContent>(null);
	contentRef.current = content;
	function setStateFromProps() {
		const contentNode = document.createElement('span');
		contentNode.innerHTML = contentRef.current.html;
		state.value = EditorState.create({
			schema: editor.editorSchema.schema,
			doc: editor.domParser.parse(contentNode),
			plugins: editor.editorPluginsManager.getPlugins(editor.editorSchema.schema),
		});
	}
	useEffectOnce(() => {
		setStateFromProps();
		const dispatchTransaction = (transaction: Transaction) => {
			const div = document.createElement('div');
			state.value = state.value.apply(transaction);
			view.current.updateState(state.value);
			div.appendChild(editor.domSerializer.serializeFragment(state.value.doc.content));
			if (contentRef.current.html !== div.innerHTML) {
				onContentChange(element.current.innerText || '', { html: div.innerHTML });
			}
		};

		editor.createMenu(state, dispatchTransaction);
		
		view.current = new EditorView(element.current, {
			state: state.value,
			dispatchTransaction,
			// @ts-ignore: This is probably a mistake
			// in prosemirror types; getPos should return a number
			nodeViews: editor.nodeViews,
		});
		
		return () => {
			view.current.destroy();
			editor.menu.value = null;
		};
	});
	useEffect(() => {
		setStateFromProps();
		view.current.updateState(state.value);
	}, [contentId]);
	return <div className={`EditorPresenter ${disabled ? 'EditorPresenter--disabled': ``}`}>
		{showLoading && <TextLoading className="EditorPresenter__TextLoading" />}
		<div className="EditorPresenter__Content" ref={element}></div>
	</div>;
}

export default connect(EditorPresenter);