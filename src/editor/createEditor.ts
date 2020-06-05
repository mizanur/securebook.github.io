import { EditorPlugins } from "@editor/interfaces/EditorPlugins";
import { Cursor } from "@editor/plugins/Cursor";
import { EditorPluginsManager } from "@editor/EditorPluginsManager";
import { EditorNode } from "@editor/interfaces/EditorNode";
import { EditorMark } from "@editor/interfaces/EditorMark";
import { EditorSchema } from "@editor/EditorSchema";
import { KeyBindings } from "@editor/interfaces/KeyBindings";
import { History } from "@editor/plugins/History";
import { InputRules } from "@editor/interfaces/InputRules";
import { InputRulesManager } from "@editor/plugins/InputRulesManager";
import { KeyBindingsManager } from "@editor/plugins/KeyBindingsManager";
import { CodeMark } from "@editor/marks/CodeMark";
import { EmMark } from "@editor/marks/EmMark";
import { StrongMark } from "@editor/marks/StrongMark";
import { LinkMark } from "@editor/marks/LinkMark";
import { BlockquoteNode } from "@editor/nodes/BlockquoteNode";
import { BulletListNode } from "@editor/nodes/BulletListNode";
import { CodeBlockNode } from "@editor/nodes/CodeBlockNode";
import { DocNode } from "@editor/nodes/DocNode";
import { HardBreakNode } from "@editor/nodes/HardBreakNode";
import { HeadingNode } from "@editor/nodes/HeadingNode";
import { HorizontalRuleNode } from "@editor/nodes/HorizontalRuleNode";
import { ImageNode } from "@editor/nodes/ImageNode";
import { ListItemNode } from "@editor/nodes/ListItemNode";
import { OrderedListNode } from "@editor/nodes/OrderedListNode";
import { ParagraphNode } from "@editor/nodes/ParagraphNode";
import { TextNode } from "@editor/nodes/TextNode";
import { Editor } from "@interfaces/Editor";
import { DOMParser } from 'prosemirror-model';
import { DOMSerializer } from '@editor/DOMSerializer';
import { EditorState } from "prosemirror-state";
import { connectObject } from "typeconnect";
import { Wrapped } from "@interfaces/Wrapped";
import { wrap } from "@utils/wrap";
import { UnderlineMark } from "@editor/marks/UnderlineMark";
import { StrikethroughMark } from "@editor/marks/StrikethroughMark";
import { JustifyFix } from "@editor/plugins/JustifyFix";
import { TodoListItemNode } from "@editor/nodes/TodoListItemNode";
import { TodoListNode } from "@editor/nodes/TodoListNode";
import { getCreateActions } from "@editor/utils/getCreateActions";
import { getNodeViewLookup } from "@editor/utils/getNodeViewLookup";
import { Dispatch } from "@editor/interfaces/Actions";
import { ListItems } from "@editor/nodes/ListItems";
import { FontSizeMark } from "@editor/marks/FontSizeMark";
import { FontFamilyMark } from "@editor/marks/FontFamilyMark";

export function createEditor(): Editor {
	const docNode = new DocNode();
	const paragraphNode = new ParagraphNode();
	const blockquoteNode = new BlockquoteNode();
	const horizontalRuleNode = new HorizontalRuleNode();
	const headingNode = new HeadingNode();
	const textNode = new TextNode();
	const codeBlockNode = new CodeBlockNode();
	const imageNode = new ImageNode();
	const hardBreakNode = new HardBreakNode();
	const orderedListNode = new OrderedListNode();
	const bulletListNode = new BulletListNode();
	const todoListNode = new TodoListNode();
	const listItemNode = new ListItemNode();
	const todoListItemNode = new TodoListItemNode();
	const linkMark = new LinkMark();
	const emMark = new EmMark();
	const strongMark = new StrongMark();
	const underlineMark = new UnderlineMark();
	const strikethroughMark = new StrikethroughMark();
	const codeMark = new CodeMark();
	const fontSizeMark = new FontSizeMark();
	const fontFamilyMark = new FontFamilyMark();
	const history = new History();
	const cursor = new Cursor();
	const editorNodes: EditorNode[] = [
		docNode,
		paragraphNode,
		blockquoteNode,
		horizontalRuleNode,
		headingNode,
		textNode,
		codeBlockNode,
		imageNode,
		hardBreakNode,
		todoListNode,
		orderedListNode,
		bulletListNode,
		todoListItemNode,
		listItemNode,
	];
	const editorMarks: EditorMark[] = [
		strongMark,
		emMark,
		underlineMark,
		strikethroughMark,
		linkMark,
		codeMark,
		fontSizeMark,
		fontFamilyMark,
	];
	const editorSchema = new EditorSchema(editorNodes, editorMarks);
	const listItems = new ListItems(editorSchema.schema, [
		listItemNode,
		todoListItemNode,
	]);
	const inputRules: InputRules[] = [
		blockquoteNode,
		headingNode,
		codeBlockNode,
		orderedListNode,
		bulletListNode,
		todoListNode,
	];
	const inputRulesManager = new InputRulesManager(inputRules);
	const keyBindings: KeyBindings[] = [
		blockquoteNode,
		headingNode,
		codeBlockNode,
		hardBreakNode,
		orderedListNode,
		bulletListNode,
		listItems,
		strongMark,
		emMark,
		underlineMark,
		codeMark,
		history,
		inputRulesManager,
	];
	const keyBindingsManager = new KeyBindingsManager(keyBindings);
	const justifyFix = new JustifyFix();
	const editorPlugins: EditorPlugins[] = [
		history,
		cursor,
		inputRulesManager,
		keyBindingsManager,
		justifyFix,
	];
	const editorPluginsManager = new EditorPluginsManager(editorPlugins);
	const domParser = DOMParser.fromSchema(editorSchema.schema);
	const domSerializer = DOMSerializer.fromSchema(editorSchema.schema);
	const menu: Editor['menu'] = connectObject(wrap(null));
	return {
		menu,
		editorSchema,
		editorPluginsManager,
		domParser,
		domSerializer,
		nodeViews: getNodeViewLookup([
			codeBlockNode,
			todoListItemNode,
		]),
		createMenu(state: Wrapped<EditorState>, dispatchTransaction: Dispatch) {
			const createActions = getCreateActions(editorSchema, state, dispatchTransaction);
			menu.value = {
				state: connectObject({
					history: history.getMenuState(state),
					strong: strongMark.getMenuState(state, editorSchema.schema),
					em: emMark.getMenuState(state, editorSchema.schema),
					underline: underlineMark.getMenuState(state, editorSchema.schema),
					strikethrough: strikethroughMark.getMenuState(state, editorSchema.schema),
					link: linkMark.getMenuState(state, editorSchema.schema),
					fontSize: fontSizeMark.getMenuState(state, editorSchema.schema),
					fontFamily: fontFamilyMark.getMenuState(state, editorSchema.schema),
					code: codeMark.getMenuState(state, editorSchema.schema),
					blockquote: blockquoteNode.getMenuState(state, editorSchema.schema),
					codeBlock: codeBlockNode.getMenuState(state, editorSchema.schema),
					heading: headingNode.getMenuState(state, editorSchema.schema),
					paragraph: paragraphNode.getMenuState(state, editorSchema.schema),
					bulletList: bulletListNode.getMenuState(state, editorSchema.schema),
					orderedList: orderedListNode.getMenuState(state, editorSchema.schema),
					todoList: todoListNode.getMenuState(state, editorSchema.schema),
					listItems: listItems.getMenuState(state),
				}),
				actions: {
					history: createActions(history.getMenuActions),
					strong: createActions(strongMark.getMenuActions),
					em: createActions(emMark.getMenuActions),
					underline: createActions(underlineMark.getMenuActions),
					strikethrough: createActions(strikethroughMark.getMenuActions),
					link: createActions(linkMark.getMenuActions),
					fontSize: createActions(fontSizeMark.getMenuActions),
					fontFamily: createActions(fontFamilyMark.getMenuActions),
					code: createActions(codeMark.getMenuActions),
					blockquote: createActions(blockquoteNode.getMenuActions),
					codeBlock: createActions(codeBlockNode.getMenuActions),
					heading: createActions(headingNode.getMenuActions),
					horizontalRule: createActions(horizontalRuleNode.getMenuActions),
					paragraph: createActions(paragraphNode.getMenuActions),
					bulletList: createActions(bulletListNode.getMenuActions),
					orderedList: createActions(orderedListNode.getMenuActions),
					todoList: createActions(todoListNode.getMenuActions),
					listItems: createActions(listItems.getMenuActions),
				},
			};
		}
	};
}