import { h } from 'preact';
import { DropDown, DropDownItem } from '@components/DropDown';
import Icon from '@components/Icon';
import Input from '@components/Input';
import "@styles/ColorPicker.scss";
import { isHexColorValid, getColorFromHex, rgbToHsv, hsvToRgb, getHexFromColor } from '@utils/color';
import { useRef, useState, useEffect } from 'preact/hooks';
import { useUnmount } from '@view/useUnmount';
import { cap } from '@utils/number';

type MainPickerData = {
	started: false,
} | {
	started: true,
	rect: {
		top: number,
		left: number,
		width: number,
		height: number,
	},
};

type HuePickerData = {
	started: false,
} | {
	started: true,
	rect: {
		top: number,
		height: number,
	},
};

function ColorPicker(
	{ currentColor, onColor }:
	{ currentColor: null | string, onColor: (hex: null | string) => any }
) {
	const mainPickerRef = useRef<HTMLDivElement>();
	const huePickerRef = useRef<HTMLDivElement>();
	const mainPicker = useRef<MainPickerData>({
		started: false,
	});
	const huePicker = useRef<HuePickerData>({
		started: false,
	});

	const [color, setColor] = useState(() => color);

	useEffect(
		() => {
			if (currentColor !== color) {
				setColor(currentColor);
			}
		},
		[currentColor]
	);

	const desiredColor = color && isHexColorValid(color)
		? getColorFromHex(color)
		: [255,0,0] as [number,number,number];
	
	const hsv = rgbToHsv(desiredColor);
	const hueColor = hsvToRgb([hsv[0], 1, 1]);

	function setMainColor(e: MouseEvent, triggerEvent: boolean) {
		if (mainPickerRef.current && mainPicker.current.started) {
			e.preventDefault();
			const { rect } = mainPicker.current;
			const l = 1 - cap(0, 1, (e.clientY - rect.top) / rect.height);
			const s = cap(0, 1, (e.clientX - rect.left) / rect.width);

			const newColor = getHexFromColor(hsvToRgb([hsv[0], s, l]));
			setColor(newColor);

			if (triggerEvent) {
				onColor(newColor);
			}
		}
	}

	const onMainMove = (e: MouseEvent) => {
		setMainColor(e, false);
	};

	const onMainUp = (e: MouseEvent) => {
		setMainColor(e, true);
		mainPicker.current = { started: false };
		window.removeEventListener('mousemove', onMainMove);
		window.removeEventListener('mouseup', onMainUp);
	};

	function setHueColor(e: MouseEvent, triggerEvent: boolean) {
		if (huePickerRef.current && huePicker.current.started) {
			e.preventDefault();
			const { rect } = huePicker.current;
			const h = cap(0, 1, (e.clientY - rect.top) / rect.height);

			const newColor = getHexFromColor(hsvToRgb([h, hsv[1], hsv[2]]));
			setColor(newColor);

			if (triggerEvent) {
				onColor(newColor);
			}
		}
	}

	const onHueMove = (e: MouseEvent) => {
		setHueColor(e, false);
	};

	const onHueUp = (e: MouseEvent) => {
		setHueColor(e, true);
		huePicker.current = { started: false };
		window.removeEventListener('mousemove', onHueMove);
		window.removeEventListener('mouseup', onHueUp);
	};

	const onMainDown = (e: MouseEvent) => {
		if (mainPickerRef.current) {
			const rect = mainPickerRef.current.getBoundingClientRect();
			mainPicker.current = {
				started: true,
				rect: {
					top: rect.top,
					left: rect.left,
					width: rect.width,
					height: rect.height,
				},
			};
			setMainColor(e, false);
			window.addEventListener('mousemove', onMainMove);
			window.addEventListener('mouseup', onMainUp);
		}
	};

	const onHueDown = (e: MouseEvent) => {
		if (huePickerRef.current) {
			const rect = huePickerRef.current.getBoundingClientRect();
			huePicker.current = {
				started: true,
				rect: {
					top: rect.top,
					height: rect.height,
				},
			};
			setHueColor(e, false);
			window.addEventListener('mousemove', onHueMove);
			window.addEventListener('mouseup', onHueUp);
		}
	};
	
	useUnmount(() => {
		window.removeEventListener('mousemove', onMainMove);
		window.removeEventListener('mouseup', onMainUp);
	});
	
	return  <DropDown className="ColorPicker">
		<DropDownItem labelProps={{ className: "ColorPicker__InputItem" }}>
			<span
				className="ColorPicker__InputBox ColorPicker__ColorBox"
				style={{ background: `rgb(${desiredColor[0]}, ${desiredColor[1]}, ${desiredColor[2]})` }}
			/>
			<span className="ColorPicker__Hash">#</span>
			<Input
				className="ColorPicker__Input"
				type="text"
				placeholder="Hex color code"
				value={color || ''}
				onChange={e => {
					onColor(e.currentTarget.value);
				}}
			/>
			<button
				className="ColorPicker__Reset"
				onClick={() => {
					onColor(null);
				}}
			>
				<Icon
					type="format_color_reset"
				/>
			</button>
		</DropDownItem>
		<div className="ColorPicker__Pickers">
			<div
				ref={mainPickerRef}
				className="ColorPicker__MainPicker"
				style={{ background: `rgb(${hueColor[0]}, ${hueColor[1]}, ${hueColor[2]})` }}
				onMouseDown={onMainDown}
			>
				<div className="ColorPicker__SaturationPicker"></div>
				<div className="ColorPicker__LightnessPicker"></div>
				<div
					className="ColorPicker__MainPosition"
					style={{
						top: `${(1 - hsv[2]) * 100}%`,
						left: `${hsv[1] * 100}%`,
					}}
				/>
			</div>
			<div
				ref={huePickerRef}
				className="ColorPicker__HuePicker"
				onMouseDown={onHueDown}
			>
				<div
					className="ColorPicker__HuePosition"
					style={{ top: `${hsv[0]*100}%` }}
				/>
			</div>
		</div>
		<DropDownItem className="ColorPicker__DefaultColors">
			{
				[
					`001f3f`,
					`0074d9`,
					`7fdbff`,
					`39cccc`,
					`3d9970`,
					`2ecc40`,
					`01ff70`,
					`ffdc00`,
					`ff851b`,
					`ff4136`,
					`85144b`,
					`f012be`,
					`b10dc9`,
					`111111`,
					`aaaaaa`,
					`dddddd`,
					`ffffff`,
				]
				.map(color =>
					<button
						key={color}
						className="ColorPicker__ColorBox"
						style={{ background: `#${color}` }}
						onClick={() => onColor(color)}
					/>
				)
			}
		</DropDownItem>
	</DropDown>;
};

export default ColorPicker;