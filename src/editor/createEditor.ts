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
import { DOMParser, DOMSerializer } from 'prosemirror-model';

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
	const listItemNode = new ListItemNode();
	const linkMark = new LinkMark();
	const emMark = new EmMark();
	const strongMark = new StrongMark();
	const codeMark = new CodeMark();
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
		orderedListNode,
		bulletListNode,
		listItemNode,
	];
	const editorMarks: EditorMark[] = [
		linkMark,
		emMark,
		strongMark,
		codeMark,
	];
	const inputRules: InputRules[] = [
		blockquoteNode,
		headingNode,
		codeBlockNode,
		orderedListNode,
		bulletListNode,
	];
	const inputRulesManager = new InputRulesManager(inputRules);
	const keyBindings: KeyBindings[] = [
		paragraphNode,
		blockquoteNode,
		headingNode,
		codeBlockNode,
		hardBreakNode,
		orderedListNode,
		bulletListNode,
		listItemNode,
		emMark,
		strongMark,
		codeMark,
		history,
		inputRulesManager,
	];
	const keyBindingsManager = new KeyBindingsManager(keyBindings);
	const editorPlugins: EditorPlugins[] = [
		history,
		cursor,
		inputRulesManager,
		keyBindingsManager,
	];
	const editorSchema = new EditorSchema(editorNodes, editorMarks);
	const editorPluginsManager = new EditorPluginsManager(editorPlugins);
	const domParser = DOMParser.fromSchema(editorSchema.schema);
	const domSerializer = DOMSerializer.fromSchema(editorSchema.schema);
	return {
		editorSchema,
		editorPluginsManager,
		domParser,
		domSerializer,
	};
}