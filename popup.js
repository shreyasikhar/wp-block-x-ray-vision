document.addEventListener('DOMContentLoaded', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const tabId = tab.id.toString(); // Storage keys must be strings

	// Check storage for this tab's state and set the toggle accordingly
	chrome.storage.local.get([tabId], (result) => {
		if (result[tabId]) {
			document.getElementById('toggleSwitch').checked = true;
		}
	});
});

document.getElementById('toggleSwitch').addEventListener('change', async (event) => {
	const isActive = event.target.checked;
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const tabId = tab.id.toString();

	// Save state to storage.
	chrome.storage.local.set({ [tabId]: isActive });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleXRay,
		args: [isActive]
	});
});

function toggleXRay(isActive) {

	if (isActive) {
		document.body.classList.add('wp-xray-active');
		// Find every element that has a WordPress block class.
		const blocks = document.querySelectorAll('[class*="wp-block-"]');

		blocks.forEach(block => {
			// Convert classList to an array and find the one starting with "wp-block-".
			const blockClass = Array.from(block.classList).find(className =>
				className.startsWith('wp-block-') && className !== 'wp-block'
			);

			if (blockClass) {
				// Store it in a custom data attribute for CSS to read.
				block.setAttribute('data-block-name', blockClass);
			}
		});
	} else {
		document.body.classList.remove('wp-xray-active');
	}
}
