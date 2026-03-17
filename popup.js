document.getElementById('toggleBtn').addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleXRay
	});
});

function toggleXRay() {
	const isActive = document.body.classList.toggle('wp-xray-active');

	if (isActive) {
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
	}
}
