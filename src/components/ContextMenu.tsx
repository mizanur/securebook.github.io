import { h, ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useEffectOnce } from '@view/useEffectOnce';
import { nodeIsOrHasAncestor } from '@utils/html';
import '@styles/ContextMenu.scss';

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

export function ContextMenu(
	{ direction = { v: 'bottom', h: 'right' }, children, onClose, position }:
	{ direction?: Direction, children: ComponentChildren, onClose: (...args: any) => any, position: Position }
) {
	const element = useRef<HTMLDivElement>(null);
	const [isSizing, setIsSizing] = useState<boolean>(true);
	const [elementPosition, setElementPosition] = useState<ElementPosition>({ top: 0, left: 0 });
	useEffectOnce(() => {
		const closeOnClickElsewhere = (e: Event) => {
			if (!nodeIsOrHasAncestor(e.target as Node, element.current)) {
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
		const rect = element.current.getBoundingClientRect();
		const spaceAvailable = {
			top: position.y,
			right: window.innerWidth - position.x,
			bottom: window.innerHeight - position.y,
			left: position.x,
		};
		const oppositeVerticalDirection = { 'top': 'bottom', 'bottom': 'top' };
		const actualDirection = {
			v: spaceAvailable[direction.v] < rect.height
				? oppositeVerticalDirection[direction.v]
				: direction.v,
			h: direction.h,
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
				? position.y + positionDirectionModifier.top + positionFitModifier.top
				: position.y + positionDirectionModifier.top,
			left: positionFit.h < 0
				? position.x + positionDirectionModifier.left + positionFitModifier.left
				: position.x + positionDirectionModifier.left,
		});
	});
	return <div className={`ContextMenu ${isSizing ? `ContextMenu--sizing` : `ContextMenu--visible`}`} ref={element} style={{
		top: `${elementPosition.top}px`,
		left: `${elementPosition.left}px`,
	}}>{children}</div>;
}

export default ContextMenu;