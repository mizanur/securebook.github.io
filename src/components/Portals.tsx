import { h, Fragment, ComponentChildren, FunctionalComponent, ComponentConstructor } from "preact";
import { useContext, useState, useEffect, useRef } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { PortalValueContext } from "@view/PortalValueContext";
import { useEffectOnce } from "@view/useEffectOnce";
import { getValues } from "@utils/object";

let portalId = 0;

export function Portals() {
	const portalValue = useContext(PortalValueContext);
	const [,updateState] = useState({});
	const [childrenStore] = useState<{ [k: string]: ComponentChildren }>({});
	portalValue.childrenStore = childrenStore;
	portalValue.updateChildren = () => updateState({});
	return <Fragment>
		{
			getValues(childrenStore).map(
				children => <Fragment>{ children }</Fragment>
			)
		}
	</Fragment>;
}

export function Portal({ children }: { children: ComponentChildren }) {
	const portalValue = useContext(PortalValueContext);
	const index = useRef(0);
	useEffectOnce(() => {
		index.current = portalId++;
	});
	useEffect(() => {
		portalValue.childrenStore[index.current] = children;
		portalValue.updateChildren();
	}, [children]);
	useUnmount(() => {
		delete portalValue.childrenStore[index.current];
		portalValue.updateChildren();
	});
	return null;
}


export function withPortal<P,S>(Component: FunctionalComponent<P> | ComponentConstructor<P, S>) {
	return function NewComponent(props: P) {
		return <Portal>
			<Component {...props} />
		</Portal>;
	}
}