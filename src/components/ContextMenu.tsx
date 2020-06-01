import { h, ComponentChildren } from 'preact';
import { useRef, useState, Ref } from 'preact/hooks';
import { useEffectOnce } from '@view/useEffectOnce';
import { nodeIsOrHasAncestor } from '@utils/html';
import '@styles/ContextMenu.scss';
import { useUnmount } from '@view/useUnmount';
import { withPortal } from '@components/Portals';

type Direction = {
	v: 'top' | 'bottom',
	h: 'left' | 'right',
};

type Position = {
	x: number,
	y: number,
};

type ElementPosition = {
	top: number,
	left: number,
};

function ContextMenu(
	{ direction = { v: 'bottom', h: 'right' }, children, onClose, position = { x: 0, y: 0 }, relativeRef = { current: null } }:
	{ direction?: Direction, children: ComponentChildren, onClose: (...args: any) => any, position?: Position, relativeRef?: Ref<null | HTMLElement> }
) {
	let isClosed = useRef<boolean>(false);
	const element = useRef<HTMLDivElement>(null);
	const [isSizing, setIsSizing] = useState<boolean>(true);
	const [elementPosition, setElementPosition] = useState<ElementPosition>({ top: 0, left: 0 });
	useEffectOnce(() => {
		const closeOnClickElsewhere = (e: Event) => {
			if (!nodeIsOrHasAncestor(e.target as Node, element.current)) {
				isClosed.current = true;
				onClose();
			}
		};
		document.body.addEventListener('mousedown', closeOnClickElsewhere);
		document.body.addEventListener('contextmenu', closeOnClickElsewhere);
		window.addEventListener('scroll', closeOnClickElsewhere, true);
		return () => {
			document.body.removeEventListener('mousedown', closeOnClickElsewhere);
			document.body.removeEventListener('contextmenu', closeOnClickElsewhere);
			window.removeEventListener('scroll', closeOnClickElsewhere, true);
		};
	});
	useEffectOnce(() => {
		const oppositeDirection = { 'top': 'bottom', 'bottom': 'top', 'left': 'right', 'right': 'left' };
		const rect = element.current.getBoundingClientRect();
		const relativeRect = relativeRef.current
			? relativeRef.current.getBoundingClientRect()
			: null;
		const dir: Direction = !relativeRect
			? direction
			: { v: direction.v, h: oppositeDirection[direction.h] as 'right' | 'left' };
		const pos = !relativeRect
			? position
			: {
				x: dir.h === 'right' ? relativeRect.left : relativeRect.left + relativeRect.width,
				y: dir.v === 'top' ? relativeRect.top : relativeRect.top + relativeRect.height,
			};
		const spaceAvailable = {
			top: pos.y,
			right: window.innerWidth - pos.x,
			bottom: window.innerHeight - pos.y,
			left: pos.x,
		};
		const actualDirection = {
			v: spaceAvailable[dir.v] < rect.height
				? oppositeDirection[dir.v]
				: dir.v,
			h: dir.h,
		};
		const positionFit = {
			v: spaceAvailable[actualDirection.v] - rect.height,
			h: spaceAvailable[actualDirection.h] - rect.width,
		};
		const positionDirectionModifier = {
			top: actualDirection.v === 'top' ? -rect.height : 0,
			left: actualDirection.h === 'left' ? -rect.width : 0,
		};
		const positionFitModifier = {
			top: actualDirection.v === 'bottom' ? positionFit.v : -positionFit.v,
			left: actualDirection.h === 'right' ? positionFit.h : -positionFit.h,
		};
		setIsSizing(false);
		setElementPosition({
			top: positionFit.v < 0
				? pos.y + positionDirectionModifier.top + positionFitModifier.top
				: pos.y + positionDirectionModifier.top,
			left: positionFit.h < 0
				? pos.x + positionDirectionModifier.left + positionFitModifier.left
				: pos.x + positionDirectionModifier.left,
		});
	});
	useUnmount(() => {
		if (!isClosed.current) {
			onClose();
		}
	});
	return <div className={`ContextMenu ${isSizing ? `ContextMenu--sizing` : `ContextMenu--visible`}`} ref={element} style={{
		top: `${elementPosition.top}px`,
		left: `${elementPosition.left}px`,
	}}>{children}</div>;
}

export default withPortal(ContextMenu);