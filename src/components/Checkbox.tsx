import { h } from 'preact';
import Icon from '@components/Icon';
import "@styles/Checkbox.scss";

function Checkbox({ isChecked, onSetChecked, ...rest }: { isChecked: boolean, onSetChecked?: (newValue: boolean) => any } & h.JSX.HTMLAttributes<HTMLButtonElement>) {
	return <button
			{ ...rest }
			className={`Checkbox ${rest.class || rest.className || ''}`}
			onClick={function (e) {
				if (onSetChecked) {
					onSetChecked(!isChecked);
				}
				if (rest.onClick) {
					return rest.onClick.call(this, e);
				}
			}}
		>
			<Icon type="check_box" className={`Checkbox__Icon ${
				isChecked ? `Checkbox__Icon--visible`: `Checkbox__Icon--invisible`
			}`} />
			<Icon type="check_box_outline_blank" className={`Checkbox__Icon ${
				isChecked ? `Checkbox__Icon--invisible`: `Checkbox__Icon--visible`
			}`} />
		</button>;
}

export default Checkbox;