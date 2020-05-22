import { AuthData } from "@interfaces/AuthData";

export interface GitlabAuthData extends AuthData {
	headers: {} | { authorization: string };
}