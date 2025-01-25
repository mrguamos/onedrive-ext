// Store logs in memory
let logs = [];

function addLog(message) {
  const timestamp = new Date().toLocaleTimeString();
  logs.push(`[${timestamp}] ${message}`);
  // Keep only last 100 logs
  if (logs.length > 100) logs.shift();
}

chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.includes("GetSharingInformation")) {
       console.log(details)
      addLog(`GetSharingInformation Response:`);
      addLog(`  Status: ${details.statusCode}`);
    }
  },
  { urls: ["https://opera8com-my.sharepoint.com/*"] },
  ["responseHeaders"]
);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getLogs') {
    sendResponse(logs);
  }
}); 