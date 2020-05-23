import { h } from "preact";
import "@styles/WelcomePage.scss";
import { connect } from "@view/connect";
import { useContext } from "preact/hooks";
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";
import { Logo } from "@components/Logo";

function WelcomePage() {
	const { authData } = useContext(StoreContext);
	const { auth } = useContext(ManagersContext);

	return (
		<main className="WelcomePage">
			<article className="WelcomePage__WelcomeCard">
				<section className="WelcomePage__Header WelcomePage__AppName">Secure Book</section>
				<section className="WelcomePage__Information">
					<p><span className="WelcomePage__AppName">Secure Book</span> is a private note-taking web application.</p>
					<p>It allows you to create your own private notebooks and write encrypted notes.</p>
				</section>
				<section className="WelcomePage__HowSection">
					<p className="WelcomePage__How">How does it work?</p>
					<ol className="WelcomePage__HowList">
						<li className="WelcomePage__HowListItem">Sign in via GitLab. GitLab is a service that allows you to create private / public repositories and store content inside of them.</li>
						<li className="WelcomePage__HowListItem">Create a notebook and choose a password for it. Nobody will be able to read the contents of the notebook without knowing the password.</li>
						<li className="WelcomePage__HowListItem">Create, edit and delete private notes, create and customize multiple notebooks.</li>
					</ol>
				</section>
				{
					authData.data.error ?
					<section className="WelcomePage__CredentialsError">
						Error: {authData.data.error}. {authData.data.errorDescription}
					</section> :
					null
				}
				<button className="WelcomePage__LoginButton" onClick={() => { auth.login(); }}>
					Login via GitLab
				</button>
			</article>
		</main>
	);
}

export default connect(WelcomePage);