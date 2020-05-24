import { connectFactory } from "typeconnect";
import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";
import { Connected } from "@interfaces/Connected";
import { createRenderer } from "@data/createRenderer";
import { Crypter } from "@view/Crypter";
import { createLocation } from "@view/createLocation";
import { QueryBuilder } from "@modules/QueryBuilder";
import { createIntents } from "@data/createIntents";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";
import { GitlabAuth } from "@modules/GitlabAuth";
import { LocationManager } from "@view/LocationManager";
import { GitlabDev } from "@configs/GitlabDev";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { GitlabAuthStorage } from "@modules/GitlabAuthStorage";
import { PathManager } from "@modules/PathManager";
import { createNoteViewerIntent } from "@data/createNoteViewerIntent";
import { GitlabFilesystem } from "@modules/GitlabFilesystem";
import { GitlabRequest } from "@modules/GitlabRequest";
import { GitlabProjectManager } from "@modules/GitlabProjectManager";
import { createGitlabData } from "@data/createGitlabData";
import { Request } from "@view/Request";
import { GitlabCommits } from "@modules/GitlabCommits";

export function createApp(): [Connected, Store, Managers] {
	const connected: Connected = {
		createRenderer: connectFactory(createRenderer),
		createLocation: connectFactory(createLocation),
		createGitlabAuthIntent: connectFactory(createGitlabAuthIntent),
		createGitlabAuthData: connectFactory(createGitlabAuthData),
		createIntents: connectFactory(createIntents),
		createNoteViewerIntent: connectFactory(createNoteViewerIntent),
		createGitlabData: connectFactory(createGitlabData),
	};

	const crypter = new Crypter();
	const queryBuilder = new QueryBuilder();
	const location = connected.createLocation(queryBuilder);
	const locationManager = new LocationManager(location);
	const gitlabConfig = new GitlabDev();
	const gitlabAuthStorage = new GitlabAuthStorage();
	const gitlabAuthData = connected.createGitlabAuthData();
	const gitlabAuth = new GitlabAuth(locationManager, gitlabConfig, queryBuilder, gitlabAuthStorage, gitlabAuthData);
	const pathManager = new PathManager(locationManager);
	const gitlabAuthIntent = connected.createGitlabAuthIntent(location, pathManager, gitlabAuth);
	const bookSelectIntent = connected.createNoteViewerIntent(location);
	const gitlabProjectManager = new GitlabProjectManager(gitlabAuthData, gitlabConfig);
	const gitlabData = connected.createGitlabData();
	const request = new Request();
	const gitlabRequest = new GitlabRequest(gitlabAuthData, gitlabProjectManager, gitlabConfig, gitlabData, request);
	const gitlabCommits = new GitlabCommits(gitlabRequest);
	const filesystem = new GitlabFilesystem(gitlabRequest, gitlabCommits, queryBuilder);

	const intents = connected.createIntents([
		gitlabAuthIntent,
		bookSelectIntent,
	]);
	
	return [
		connected,
		{
			intents,
			authData: gitlabAuthData,
		},
		{
			crypter,
			auth: gitlabAuth,
			filesystem,
		}
	]
}