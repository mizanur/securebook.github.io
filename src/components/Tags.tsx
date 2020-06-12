import { h, Fragment } from 'preact';
import { useState, useEffect, useRef, useContext, useMemo } from 'preact/hooks';
import Input, { InputProps } from '@components/Input';
import ContextMenu, { Direction } from '@components/ContextMenu';
import { connect } from '@view/connect';
import { StoreContext } from '@view/StoreContext';
import { DropDown, DropDownItem } from '@components/DropDown';
import "@styles/Tags.scss";
import { keycodes } from '@utils/keycode';

function Tags(
	{ tags, isNewAllowed = false, isChangedOnInput = false, direction = { v: 'bottom', h: 'left' }, onTagsChange, ...rest }:
	{ tags: string[], isNewAllowed?: boolean, isChangedOnInput?: boolean, direction?: Direction, onTagsChange: (tags: string[]) => any } & InputProps
) {
	const { notes } = useContext(StoreContext);
	const [currentTags, setCurrentTags] = useState(tags);
	const tagsString = currentTags.join(' ');
	const fieldRef = useRef<HTMLInputElement>(null);
	const [selectedTagIndex, setSelectedTagIndex] = useState<null | number>(null);
	const selectedTag = selectedTagIndex != null ? currentTags[selectedTagIndex] : null;
	const [selection, setSelection] = useState<null | number>(null);
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

	useEffect(
		() => {
			if (selection != null) {
				let selectedIndex;
				let length = 0;
				for (let i = 0; i < currentTags.length; i++) {
					if (currentTags[i].length && selection >= length && selection <= length + currentTags[i].length) {
						selectedIndex = i;
						break;
					}
					length += currentTags[i].length + 1;
				}
				if (selectedIndex != null) {
					setSelectedTagIndex(selectedIndex);
					return;
				}
			}

			setSelectedTagIndex(null);
		},
		[selection, currentTags]
	);

	useEffect(
		() => setCurrentTags(tags),
		[tags]
	);

	useEffect(
		() => {
			const element = document.querySelector(`.Tags__Suggestion--${activeSuggestionIndex}`);
			if (element) {
				element.scrollIntoView();
			}
		},
		[activeSuggestionIndex]
	);

	const suggestions = useMemo(
		() => {
			let suggestions: string[] = [];
		
			if (selectedTagIndex != null && selectedTag != null) {
				const otherCurrentTags = [ ...currentTags ];
				otherCurrentTags.splice(selectedTagIndex, 1);
		
				if (isNewAllowed) {
					suggestions.push(selectedTag);
				}
		
				suggestions.push(
					...notes.tags.filter(
						tag =>
							tag.toLowerCase().indexOf(selectedTag.toLowerCase()) >= 0 &&
							(!isNewAllowed || tag !== selectedTag)
					)
				);
		
				suggestions = suggestions
					.filter(tag => otherCurrentTags.indexOf(tag) < 0);
			}

			return suggestions;
		},
		[
			notes.tags,
			isNewAllowed,
			currentTags,
			selectedTagIndex,
			selectedTag,
		]
	);

	function setSuggestion(index) {
		if (selectedTagIndex != null) {
			const suggestion = suggestions[index];
			const newTags = [ ...currentTags ];
			newTags[selectedTagIndex] = suggestion;

			if (newTags[newTags.length - 1]) {
				newTags.push('');
			}

			setCurrentTags(newTags);
			setSelection(newTags.join(' ').length);
			fieldRef.current.focus();

			onTagsChange(newTags);
		}
	}

	function isChangingSuggestionIndex(e: KeyboardEvent) {
		return suggestions.length > 0 && (e.keyCode === keycodes.arrowup || e.keyCode === keycodes.arrowdown);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (isChangingSuggestionIndex(e)) {
			e.preventDefault();
			let newActiveSuggestionIndex = activeSuggestionIndex + (e.keyCode === keycodes.arrowup ? -1 : 1);
			newActiveSuggestionIndex = (
				newActiveSuggestionIndex < 0 ? suggestions.length - 1 :
				newActiveSuggestionIndex >= suggestions.length ? 0 :
				newActiveSuggestionIndex
			);
			setActiveSuggestionIndex(newActiveSuggestionIndex);
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		if (e.keyCode === keycodes.enter) {
			setSuggestion(activeSuggestionIndex);
		}
		else {
			const newTags = fieldRef.current.value.split(/\s+/);

			setSelection(
				fieldRef.current.selectionStart != null && fieldRef.current.selectionEnd != null
					? Math.min(fieldRef.current.selectionStart, fieldRef.current.selectionEnd) :
				fieldRef.current.selectionStart != null
					? fieldRef.current.selectionStart
					: fieldRef.current.selectionEnd);
			setCurrentTags(newTags);

			if (isChangedOnInput || newTags.length < currentTags.length || fieldRef.current.value.length < 1) {
				onTagsChange(newTags);
			}
		}

		if (!isChangingSuggestionIndex(e)) {
			setActiveSuggestionIndex(0);
		}
	}

	return <Fragment>
		<Input
			{...rest}
			type="text"
			value={tagsString}
			onKeyUp={onKeyUp}
			onKeyDown={onKeyDown}
			fieldRef={fieldRef}
		/>
		{
			selectedTag != null && <ContextMenu
				relativeRef={fieldRef}
				direction={direction}
				onClose={() => setSelectedTagIndex(null)}
			>
				<DropDown className="Tags__DropDown">
					{
						suggestions.length > 0 &&
							suggestions.map((tag, i) =>
								<DropDownItem
									selected={activeSuggestionIndex === i}
									className={`Tags__Suggestion Tags__Suggestion--${i}`}
									label={tag}
									onClick={() => setSuggestion(i)}
								/>
							)
					}
				</DropDown>
			</ContextMenu>
		}
	</Fragment>;
}

export default connect(Tags);