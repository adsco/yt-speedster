const buttonsContainer = document.getElementById('buttons-container');
const speeds = [{
	label: '0.5',
	value: 0.5
}, {
	label: '0.75',
	value: 0.75
}, {
	label: 'normal',
	value: 1
}, {
	label: '1.5',
	value: 1.5
}, {
	label: '2',
	value: 2
}];
const BUTTON_CLASS_NAME = 'button-speed';
const BUTTON_ACTIVE_CLASS_NAME = 'button-speed-active';
const DEFAULT_PLAYBACK_RATE = 1;
const STORAGE_KEY = 'playbackRate';

main();

function main() {
	let buttons = createButtons();

	renderButtons(buttons);
	
	buttons.forEach((button) => {
		let speed = button.data.speed;

		button.elementRef.addEventListener('click', function() {
			setPlaybackRate(speed);
			markActiveButtonBySpeed(buttons, speed);
		});
	});
	
	getPlaybackRate((playbackRate) => {
		markActiveButtonBySpeed(buttons, playbackRate);
	});
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		for (let key in changes) {
			if (key === STORAGE_KEY) {
				playbackRate = changes[key].newValue;

				markActiveButtonBySpeed(buttons, playbackRate);
				
				break;
			}
		}
	});
}

function renderButtons(buttons) {
	buttons.forEach((button) => {
		buttonsContainer.appendChild(button.elementRef);
	});
}

function createButtons() {
	let buttons = [];

	for (let i = 0, len = speeds.length; i < len; i++) {
		buttons.push({
			elementRef: createButton(speeds[i].label),
			data: {
				speed: speeds[i].value
			}
		});
	}
	
	return buttons;
}

function createButton(label) {
	let button = document.createElement('button');
	let text = document.createTextNode(label);
	
	button.classList.add(BUTTON_CLASS_NAME);
	button.appendChild(text);
	
	return button;
}

function markActiveButtonBySpeed(buttons, speed) {
	buttons.forEach((button) => {
		if (button.data.speed === speed) {
			button.elementRef.classList.add(BUTTON_ACTIVE_CLASS_NAME);
		} else {
			button.elementRef.classList.remove(BUTTON_ACTIVE_CLASS_NAME);
		}
	});
}

function setPlaybackRate(playbackRate) {
	chrome.storage.sync.set({
		[STORAGE_KEY]: playbackRate
	});
}

function getPlaybackRate(callback) {
	chrome.storage.sync.get(STORAGE_KEY, (data) => {
		callback(data[STORAGE_KEY] || DEFAULT_PLAYBACK_RATE);
	});
}