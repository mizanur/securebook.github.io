import  { h } from 'preact';
import { NodeViewProps } from '@interfaces/NodeView';
import { createNodeViewComponent } from '@view/NodeView';
import Checkbox from '@components/Checkbox';

type TodoListItemAttrs = { done: boolean };

type TodoListItemProps = NodeViewProps<TodoListItemAttrs>;

const type = `todo_item`;

function TodoListItem({ attrs, setAttrs }: TodoListItemProps) {
	return <li
		className="TodoList__Item"
		data-type={type}
		data-attrs={JSON.stringify(attrs)}
	>
		<Checkbox
			className="TodoList__CheckButton"
			isChecked={attrs.done}
			contentEditable={false}
			onSetChecked={done => setAttrs({...attrs, done})}
		/>
		<div data-content={type} className={`TodoList__Content ${
			attrs.done ? `TodoList__Content--done`: ``
		}`} />
	</li>;
}

export default createNodeViewComponent(TodoListItem, {
	type,
	tag: 'li',
	defaultAttrs: { done: false },
});