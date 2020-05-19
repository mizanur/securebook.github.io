import { useContext } from "preact/hooks";
import { ManagersContext } from '@context/ManagersContext';
import { Managers } from "@interfaces/Managers";

export function useManager<T extends keyof Managers>(location: T): Managers[T] {
	const managers = useContext(ManagersContext);
	return managers[location];
}