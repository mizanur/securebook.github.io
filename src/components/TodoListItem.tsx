import  { h } from 'preact';
import Icon from '@components/Icon';
import { NodeViewProps } from '@interfaces/NodeView';
import { useEffectOnce } from '@view/useEffectOnce';
import { createNodeViewComponent } from '@view/NodeView';

type TodoListItemAttrs = { done: boolean };

type TodoListItemProps = NodeViewProps<TodoListItemAttrs>;

const type = `todo_item`;

function TodoListItem({ attrs, setAttrs }: TodoListItemProps) {
	useEffectOnce(() => {
		console.log('mount');
		return () => {
			console.log('unmount');
		};
	});
	return <li
		className="TodoList__Item"
		data-type={type}
		data-attrs={JSON.stringify(attrs)}
	>
		<button
			className="TodoList__CheckButton"
			contentEditable={false}
			onClick={() => setAttrs({
				...attrs,
				done: !attrs.done,
			})}
		>
			<Icon type="check_box" className={`TodoList__Icon ${
				attrs.done ? `TodoList__Icon--visible`: `TodoList__Icon--invisible`
			}`} />
			<Icon type="check_box_outline_blank" className={`TodoList__Icon ${
				attrs.done ? `TodoList__Icon--invisible`: `TodoList__Icon--visible`
			}`} />
		</button>
		<div data-content={type} className={`TodoList__Content ${
			attrs.done ? `TodoList__Content--done`: ``
		}`} />
	</li>;
}

export default createNodeViewComponent(TodoListItem, {
	type,
	defaultAttrs: { done: false },
});