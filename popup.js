document.getElementById('toggleSwitch').addEventListener('change', async (event) => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleXRay,
		args: [event.target.checked]
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
