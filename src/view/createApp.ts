import { connectFactory } from "typeconnect";
import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";
import { Connected } from "@interfaces/Connected";
import { createRenderer } from "@data/createRenderer";
import { Crypter } from "@view/Crypter";
import { Crypter as ICrypter } from "@interfaces/Crypter";
import { createLocation } from "@view/createLocation";
import { QueryBuilder } from "@modules/QueryBuilder";
import { QueryBuilder as IQueryBuilder } from "@interfaces/QueryBuilder";
import { createIntents } from "@data/createIntents";
import { Intents } from "@interfaces/Intents";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";
import { Intent } from "@interfaces/Intent";
import { Location } from "@interfaces/Location";
import { GitlabAuth } from "@modules/GitlabAuth";
import { GitlabAuth as IGitlabAuth } from "@interfaces/GitlabAuth";
import { LocationManager } from "@view/LocationManager";
import { LocationManager as ILocationManager } from "@interfaces/LocationManager";
import { GitlabDev } from "@configs/GitlabDev";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { GitlabAuthStorage } from "@modules/GitlabAuthStorage";
import { GitlabAuthStorage as IGitlabAuthStorage } from "@interfaces/GitlabAuthStorage";
import { GitlabConfig } from "@interfaces/GitlabConfig";
import { GitlabAuthData } from "@interfaces/GitlabAuthData";
import { PathManager } from "@modules/PathManager";
import { PathManager as IPathManager } from "@interfaces/PathManager";
import { createBookSelectIntent } from "@data/createBookSelectIntent";
import { Filesystem } from "@interfaces/Filesystem";
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
		createBookSelectIntent: connectFactory(createBookSelectIntent),
		createGitlabData: connectFactory(createGitlabData),
	};

	const crypter: ICrypter = new Crypter();
	const queryBuilder: IQueryBuilder = new QueryBuilder();
	const location: Location = connected.createLocation(queryBuilder);
	const locationManager: ILocationManager = new LocationManager(location);
	const gitlabConfig: GitlabConfig = new GitlabDev();
	const gitlabAuthStorage: IGitlabAuthStorage = new GitlabAuthStorage();
	const gitlabAuthData: GitlabAuthData = connected.createGitlabAuthData();
	const gitlabAuth: IGitlabAuth = new GitlabAuth(locationManager, gitlabConfig, queryBuilder, gitlabAuthStorage, gitlabAuthData);
	const pathManager: IPathManager = new PathManager(locationManager);
	const gitlabAuthIntent: Intent = connected.createGitlabAuthIntent(location, pathManager, gitlabAuth);
	const bookSelectIntent: Intent = connected.createBookSelectIntent(location);
	const gitlabProjectManager = new GitlabProjectManager(gitlabAuthData, gitlabConfig);
	const gitlabData = connected.createGitlabData();
	const request = new Request();
	const gitlabRequest = new GitlabRequest(gitlabAuthData, gitlabProjectManager, gitlabConfig, gitlabData, request);
	const gitlabCommits = new GitlabCommits(gitlabRequest);
	const filesystem: Filesystem = new GitlabFilesystem(gitlabRequest, gitlabCommits, queryBuilder);

	const intents: Intents = connected.createIntents([
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