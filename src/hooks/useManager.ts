import { ManagersContext } from '@context/ManagersContext';
import { Managers } from "@interfaces/Managers";
import { useContext } from "preact/hooks";

export function useManager<T extends keyof Managers>(location: T): Managers[T] {
	const managers = useContext(ManagersContext);
	return managers[location];
}