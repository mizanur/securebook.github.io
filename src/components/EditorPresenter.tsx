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

function EditorPresenter(
	{ contentId, content, onContentChange, disabled = false, showLoading = false, }:
	{ contentId: any, content: NoteContent, disabled?: boolean, showLoading?: boolean, onContentChange: (textContent: string, content: NoteContent) => any }
) {
	const { editor } = useContext(StoreContext);
	const element = useRef<HTMLDivElement>(null);
	const contentRef = useRef<NoteContent>(null);
	contentRef.current = content;

	function setStateFromProps() {
		const contentNode = document.createElement('span');
		contentNode.innerHTML = contentRef.current.html;
		editor.current.state = EditorState.create({
			schema: editor.editorSchema.schema,
			doc: editor.domParser.parse(contentNode),
			plugins: editor.editorPluginsManager.getPlugins(editor.editorSchema.schema),
		});
	}

	useEffectOnce(() => {
		setStateFromProps();

		const dispatchTransaction = (transaction: Transaction) => {
			const div = document.createElement('div');
			editor.current.state = editor.current.state!.apply(transaction);
			editor.current.view!.updateState(editor.current.state);
			div.appendChild(editor.domSerializer.serializeFragment(editor.current.state.doc.content));
			if (contentRef.current.html !== div.innerHTML) {
				onContentChange(element.current.innerText || '', { html: div.innerHTML });
			}
		};
		
		editor.current.view = new EditorView(element.current, {
			state: editor.current.state!,
			dispatchTransaction,
			// @ts-ignore: This is probably a mistake in prosemirror types
			//             According to docs, getPos should return a number
			nodeViews: editor.nodeViews,
		});

		return () => {
			editor.current.view!.destroy();
			editor.current.view = null;
			editor.current.state = null;
		};
	});

	useEffect(() => {
		setStateFromProps();
		editor.current.view!.updateState(editor.current.state!);
	}, [contentId]);

	return <div className={`EditorPresenter ${disabled ? 'EditorPresenter--disabled': ``}`}>
		{showLoading && <TextLoading className="EditorPresenter__TextLoading" />}
		<div className="EditorPresenter__Content" ref={element}></div>
	</div>;
}

export default connect(EditorPresenter);