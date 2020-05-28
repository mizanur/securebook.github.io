import { useState, useMemo } from "preact/hooks";

type ContextMenuState = {
	id: any,
	x: number,
	y: number,
};

export function useContextMenu() {
	const [cm, setCM] = useState<ContextMenuState>({
		id: null,
		x: 0,
		y: 0,
	});

	const getTriggerProps = useMemo(() => (id: any) => {
		return {
			// Note: can use `useLongTap` if needed eventually
			onContextMenu: (e: MouseEvent) => {
				e.preventDefault();
				setCM(({
					id,
					x: e.clientX,
					y: e.clientY,
				}))
			},
		};
	}, []);

	const onClose = () => setCM({
		id: null,
		x: 0,
		y: 0,
	});

	return {
		contextMenuId: cm.id,
		getTriggerProps,
		contextMenuProps: {
			onClose,
			position: {
				x: cm.x,
				y: cm.y,
			},
		},
	};
}