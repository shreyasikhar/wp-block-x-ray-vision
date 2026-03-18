document.addEventListener('DOMContentLoaded', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const tabId = tab.id.toString(); // Storage keys must be strings
	const toggleSwitch = document.getElementById('toggleSwitch');

	// Restore toggle UI state for this tab and re-apply X-Ray mode after page reloads.
	chrome.storage.local.get([tabId], (result) => {
		const isActive = Boolean(result[tabId]);
		toggleSwitch.checked = isActive;
		applyXRayState(tab.id, isActive);
	});
});

document.getElementById('toggleSwitch').addEventListener('change', async (event) => {
	const isActive = event.target.checked;
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const tabId = tab.id.toString();

	// Save state to storage.
	chrome.storage.local.set({ [tabId]: isActive });

	applyXRayState(tab.id, isActive);
});


function applyXRayState(tabId, isActive) {
	chrome.scripting.executeScript({
		target: { tabId },
		function: toggleXRay,
		args: [isActive]
	});
}

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
