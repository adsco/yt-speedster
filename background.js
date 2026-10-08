const HOST = 'www.youtube.com';

chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: {hostEquals: HOST},
					})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		])
	});
});