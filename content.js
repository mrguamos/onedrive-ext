// Store items for popup
let items = [];

function addLog(message) {
  const timestamp = new Date().toLocaleTimeString();
  logs.push(`[${timestamp}] ${message}`);
  // Keep only last 100 logs
  if (logs.length > 100) logs.shift();
}

// Add this at the beginning of the file
window.onbeforeunload = function() {
    // Only clear the items array instead of all storage
    chrome.storage.local.set({ items: [] });
};

// Function to inject the script
function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('interceptor.js');
    (document.head || document.documentElement).appendChild(script);
}

// Listen for messages from the interceptor
window.addEventListener('message', async (event) => {
    if (event.data.type === 'FOLDER_INFO') {
        // Get existing items
        const { items = [] } = await chrome.storage.local.get('items');
        
        // Check if item already exists
        const newItem = event.data.data;
        const exists = items.some(item => item.id === newItem.id);
        
        if (!exists) {
            // Add new item to the beginning
            items.unshift(newItem);
            
            // Keep only last 50 items
            if (items.length > 50) {
                items.pop();
            }
            
            // Save updated items
            await chrome.storage.local.set({ items });
        }
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_ITEMS') {
        // Get items from storage
        chrome.storage.local.get('items').then(({ items = [] }) => {
            sendResponse({ type: 'FOLDER_INFO_LIST', data: items });
        });
        return true; // Keep channel open for async response
    }
});

// Inject as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
} else {
    injectScript();
}
