import { useOnce } from "@view/useOnce";
import { connectObject } from "typeconnect";

type ProvideState<T> = () => T;

export function useState<T extends Object>(getInitialState: ProvideState<T>): T {
	return useOnce(() => connectObject(getInitialState()));
}