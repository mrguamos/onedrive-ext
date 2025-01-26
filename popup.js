// Get elements
const itemsDiv = document.getElementById('items');
const clearBtn = document.getElementById('clearBtn');

function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
        <div class="name">${item.name}</div>
        <div class="id-container">
            <div class="id">${item.id}</div>
            <button class="copy-btn" title="Copy ID">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
            </button>
        </div>
    `;
    return itemDiv;
}

function addItem(data) {
    const itemDiv = createItemElement(data);
    itemsDiv.insertBefore(itemDiv, itemsDiv.firstChild);
}

// Load items directly from storage when popup opens
async function loadItems() {
    try {
        const { items = [] } = await chrome.storage.local.get('items');
        
        if (items.length > 0) {
            itemsDiv.innerHTML = ''; // Clear waiting message
            items.forEach(addItem);
        } else {
            itemsDiv.innerHTML = '<div class="empty-state">No items found. Navigate to a folder.</div>';
        }
    } catch (err) {
        itemsDiv.innerHTML = '<div class="empty-state">Error loading data</div>';
    }
}

// Clear all items
async function clearItems() {
    try {
        await chrome.storage.local.remove('items');
        itemsDiv.innerHTML = '<div class="empty-state">No items found. Navigate to a folder.</div>';
    } catch (err) {
        console.error('Error clearing items:', err);
    }
}

// Add click handler for clear button
clearBtn.addEventListener('click', clearItems);

// Load items when popup opens
loadItems(); 