// Set side panel behavior to open when user clicks extension icon in browser toolbar
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((err) => console.warn('Could not set sidePanel action behavior:', err));
  }
});

// Broadcast active tab updates to sidepanel
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    chrome.runtime.sendMessage({
      action: 'TAB_CHANGED',
      tabId: tab.id,
      url: tab.url,
      title: tab.title,
    }).catch(() => {
      // Side panel may not be open, ignore unhandled message error
    });
  } catch (err) {
    console.debug('Error getting active tab on activation:', err);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.runtime.sendMessage({
      action: 'TAB_UPDATED',
      tabId,
      url: tab.url,
      title: tab.title,
    }).catch(() => {
      // Side panel may not be open, ignore
    });
  }
});

