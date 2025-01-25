const intercept = () => {
    // Prevent multiple initializations in the same context
    if (window._interceptorInitialized) return;
    window._interceptorInitialized = true;

    console.log("Network Interceptor loaded", window.location.href);
    
    // Store original send method
    const originalSend = XMLHttpRequest.prototype.send;

    // Override XHR send method
    XMLHttpRequest.prototype.send = function(data) {
        // Add response handler before calling original send
        this.addEventListener('load', function() {
            if (this.responseURL && this.responseURL.includes('RenderListDataAsStream')) {
                try {
                    const json = JSON.parse(this.responseText);
                    const url = json.ListData.CurrentFolderSpItemUrl || json.ListData.Row[0]?.['.spItemUrl'];
                    
                    // Get folder name safely
                    let name;
                    if (json.rootFolder) {
                        const parts = json.rootFolder.split('/');
                        name = parts[parts.length - 1] || parts[parts.length - 2] || 'root';
                    } else if (json.ListData.Row?.[0]?.FileLeafRef) {
                        name = json.ListData.Row[0].FileLeafRef;
                    } else {
                        name = 'unknown';
                    }

                    // Extract the ID from the URL
                    const matches = url.match(/items\/([^/?]+)/);
                    if (matches && matches[1]) {
                        window.postMessage({
                            type: 'FOLDER_INFO',
                            data: {
                                name,
                                id: matches[1]
                            }
                        }, '*');
                    }
                    console.log({
                        name,
                        id: matches[1]
                    })
                } catch(err) {
                    console.error('XHR parse error:', err);
                }
            }
        });

        return originalSend.apply(this, arguments);
    };
}

// Execute the interceptor
intercept(); 