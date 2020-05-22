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
import { createIntentManager } from "@data/createIntentManager";
import { IntentManager } from "@interfaces/IntentManager";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";
import { Intent } from "@interfaces/Intent";
import { Location } from "@interfaces/Location";
import { GitlabAuth } from "@modules/GitlabAuth";
import { Auth } from "@interfaces/Auth";
import { LocationManager } from "@view/LocationManager";
import { LocationManager as ILocationManager } from "@interfaces/LocationManager";
import { GitlabDev } from "@configs/GitlabDev";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { GitlabAuthStorage } from "@modules/GitlabAuthStorage";
import { GitlabAuthStorage as IGitlabAuthStorage } from "@interfaces/GitlabAuthStorage";
import { GitlabConfig } from "@interfaces/GitlabConfig";
import { GitlabAuthData } from "@interfaces/GitlabAuthData";

export function createApp(): [Connected, Store, Managers] {
	const connected: Connected = {
		createRenderer: connectFactory(createRenderer),
		createLocation: connectFactory(createLocation),
		createGitlabAuthIntent: connectFactory(createGitlabAuthIntent),
	};

	const crypter: ICrypter = new Crypter();
	const queryBuilder: IQueryBuilder = new QueryBuilder();
	const location: Location = connected.createLocation(queryBuilder);
	const locationManager: ILocationManager = new LocationManager(location);
	const gitlabConfig: GitlabConfig = new GitlabDev();
	const gitlabAuthStorage: IGitlabAuthStorage = new GitlabAuthStorage();
	const gitlabAuthData: GitlabAuthData = createGitlabAuthData();
	const gitlabAuth: Auth = new GitlabAuth(locationManager, gitlabConfig, queryBuilder, gitlabAuthStorage, gitlabAuthData);
	const gitlabAuthIntent: Intent = connected.createGitlabAuthIntent(location, gitlabAuth);

	// Intents:
	const allIntents: Intent[] = [
		gitlabAuthIntent,
	];
	const intent: IntentManager = createIntentManager(allIntents);
	
	return [
		connected,
		{
		},
		{
			crypter,
		}
	]
}