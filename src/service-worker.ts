// Chrome extension background service worker
// Handles keyboard shortcut to toggle the side panel

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.windowId) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
  }
});

// Keep service worker alive
chrome.runtime.onInstalled.addListener(() => {
  console.log('Unseen Archive extension installed');
});
