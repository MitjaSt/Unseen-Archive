// Chrome extension background service worker
// Handles keyboard shortcut and icon click to open the side panel

// Note: Chrome's side panel API doesn't support programmatic closing.
// Users can close it by clicking the X button or clicking outside the panel.

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.windowId) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Unseen Archive extension installed');
});
