import { h } from "preact";
import "@styles/Welcome.scss";
import { connect } from "@view/connect";
import { useContext } from "preact/hooks";
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";

function Welcome() {
	const { authData } = useContext(StoreContext);
	const { auth } = useContext(ManagersContext);

	return (
		<main className="Welcome">
			<article className="Welcome__WelcomeCard">
				<h1 className="Welcome__Header Welcome__AppName">Secure Book</h1>
				<section className="Welcome__Information">
					<p><span className="Welcome__AppName">Secure Book</span> is a private note-taking web application.</p>
					<p>It allows you to create your own private notebooks and write <strong>aes-256</strong> encrypted notes.</p>
				</section>
				<section className="Welcome__HowSection">
					<h2 className="Welcome__How">How does it work?</h2>
					<ol className="Welcome__HowList">
						<li className="Welcome__HowListItem">Sign in via GitLab. GitLab is a service that allows you to create private repositories and store content inside of them.</li>
						<li className="Welcome__HowListItem">Create a notebook and choose a password for it. Nobody will be able to read the contents of the notebook without knowing the password.</li>
						<li className="Welcome__HowListItem">Create, edit and delete private notes, create and customize multiple notebooks.</li>
					</ol>
				</section>
				{
					authData.data.error ?
					<section className="Welcome__CredentialsError">
						Error: {authData.data.error}. {authData.data.errorDescription}
					</section> :
					null
				}
				<button className="Welcome__LoginButton" onClick={() => { auth.login(); }}>
					Login via GitLab
				</button>
			</article>
		</main>
	);
}

export default connect(Welcome);