// Clear storage on page refresh
window.onbeforeunload = function() {
    try {
        if (chrome?.storage?.local) {
            chrome.storage.local.set({ items: [] }).catch(() => {});
        }
    } catch (error) {}
};

// Listen for messages from the interceptor
window.addEventListener('message', async (event) => {
    if (event.data.type === 'FOLDER_INFO') {
        try {
            const { items = [] } = await chrome.storage.local.get('items');
            const newItem = event.data.data;
            
            // Only add if item doesn't exist
            if (!items.some(item => item.id === newItem.id)) {
                items.unshift(newItem);
                if (items.length > 50) items.pop();
                await chrome.storage.local.set({ items });
            }
        } catch (error) {}
    }
});

// Inject script
function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('interceptor.js');
    (document.head || document.documentElement).appendChild(script);
}

// Inject as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
} else {
    injectScript();
}
