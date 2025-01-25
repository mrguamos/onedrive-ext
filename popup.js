// Get elements
const itemsDiv = document.getElementById('items');
const clearBtn = document.getElementById('clearBtn');

function addItem(data) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
        <div class="name">${data.name}</div>
        <div class="id">${data.id}</div>
    `;
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