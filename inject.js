let video = document.getElementsByTagName('video')[0];
const storageKeyName = 'playbackRate';

console.log('reinit');

if (video) {
	chrome.storage.sync.get(storageKeyName, function(data) {
		let playbackRate = data[storageKeyName];

		if (!data.hasOwnProperty(storageKeyName)) {
			chrome.storage.sync.set({[storageKeyName]: 1});
			playbackRate = 1;
		}

		if (!video.paused) {
			video.playbackRate = playbackRate;
		}

		video.addEventListener('play', function() {
			chrome.storage.sync.get(storageKeyName, function(data) {
				video.playbackRate = data[storageKeyName];
			});
		});

		video.addEventListener('ratechange', function() {
			console.log('rate changed: ', video.playbackRate);
		});
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if (!changes.hasOwnProperty(storageKeyName)) {
			return;
		}

		video.playbackRate = changes[storageKeyName].newValue;
	});
}
