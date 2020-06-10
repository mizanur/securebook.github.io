import { h, ComponentChildren } from 'preact';
import { donate } from '@configs/Donate';

function Donate({ children }: { children: ComponentChildren }) {
	return <form
		action="https://www.paypal.com/cgi-bin/webscr"
		method="post"
		target="_blank"
		onClick={e => e.currentTarget.submit()}
	>
		<input type="hidden" name="cmd" value="_s-xclick" />
		<input type="hidden" name="hosted_button_id" value={donate.buttonId} />
		{children}
	</form>;
}

export default Donate;