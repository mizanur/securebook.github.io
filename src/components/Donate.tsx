import { h, ComponentChildren, RefObject } from 'preact';
import { donate } from '@configs/Donate';

function Donate({ children, formRef }: { children: ComponentChildren, formRef: RefObject<HTMLFormElement> }) {
	return <form
		ref={formRef}
		action="https://www.paypal.com/cgi-bin/webscr"
		method="post"
		target="_blank"
	>
		<input type="hidden" name="cmd" value="_s-xclick" />
		<input type="hidden" name="hosted_button_id" value={donate.buttonId} />
		{children}
	</form>;
}

export default Donate;