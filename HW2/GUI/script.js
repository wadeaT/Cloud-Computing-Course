// Global state
let isSearching = false;

// Search functionality
function sendSearchString() {
    const searchText = document.getElementById('searchbartext').value;
    if (searchText.trim() !== '' && !isSearching) {
        isSearching = true;
        showLoading();
        try {
            google.colab.kernel.invokeFunction('notebook.receive_search_string', [searchText], {})
                .catch(error => {
                    console.error('Search error:', error);
                    showError('An error occurred while searching');
                })
                .finally(() => {
                    isSearching = false;
                });
        } catch (error) {
            console.error('Failed to invoke search:', error);
            showError('Failed to start search');
            isSearching = false;
        }
    }
}

// Loading and error handlers
function showLoading() {
    const loadingMessages = [
        "Searching through documents...",
        "Processing your request...",
        "Finding relevant results...",
        "Almost there..."
    ];
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <div class="loading-text">${randomMessage}</div>
            </div>
        `;
    }
    // Clear previous results while loading
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
}

function showError(message) {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.innerHTML = '';
    }
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Search input handler
    const searchInput = document.getElementById('searchbartext');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendSearchString();
            }
        });
        
        // Add input validation
        searchInput.addEventListener('input', function() {
            const searchButton = document.getElementById('searchbutton');
            if (searchButton) {
                searchButton.disabled = this.value.trim() === '';
            }
        });
    }

    // Search button handler
    const searchButton = document.getElementById('searchbutton');
    if (searchButton) {
        searchButton.addEventListener('click', sendSearchString);
    }
});

// Navigation functions
function backToHomePage() {
    try {
        google.colab.kernel.invokeFunction('notebook.back_to_home_page', [], {});
    } catch (error) {
        console.error('Navigation error:', error);
        showError('Failed to navigate to home page');
    }
}

function openIndexeditorPage() {
    try {
        google.colab.kernel.invokeFunction('notebook.open_indexeditor_page', [], {});
    } catch (error) {
        console.error('Navigation error:', error);
        showError('Failed to open index editor');
    }
}

function openStatisticsScreen() {
    try {
        google.colab.kernel.invokeFunction('notebook.open_statistics_screen', [], {});
    } catch (error) {
        console.error('Navigation error:', error);
        showError('Failed to open statistics');
    }
}

// Admin functionality
function validateAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === '123456') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
    } else {
        alert('Invalid password. Please try again.');
        // Clear password field after failed attempt
        document.getElementById('adminPassword').value = '';
    }
}

// Results rendering with improved error handling
function renderResults_title_link(titles, links, texts, queryCount) {
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    if (loadingDiv) {
        loadingDiv.innerHTML = ''; // Clear loading indicator
    }
    
    if (!resultsDiv) {
        console.error('Results container not found');
        return;
    }

    resultsDiv.innerHTML = '';

    if (!titles || !links || !texts || titles.length === 0) {
        resultsDiv.innerHTML = '<div class="result-item no-results">No results found</div>';
        return;
    }

    try {
        // Add query count
        const countDiv = document.createElement('div');
        countDiv.className = 'query-count';
        countDiv.textContent = `Found ${queryCount} matches`;
        resultsDiv.appendChild(countDiv);

        // Add results
        titles.forEach((title, index) => {
            if (!title || !links[index] || !texts[index]) return;

            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Title with link
            const titleElement = document.createElement('h3');
            const linkElement = document.createElement('a');
            linkElement.href = links[index];
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer'; // Security best practice
            linkElement.textContent = title;
            titleElement.appendChild(linkElement);
            
            // Description text
            const textElement = document.createElement('p');
            textElement.textContent = texts[index];
            
            // URL display
            const urlElement = document.createElement('small');
            urlElement.className = 'result-url';
            urlElement.textContent = links[index];
            
            // Assemble result item
            resultItem.appendChild(titleElement);
            resultItem.appendChild(textElement);
            resultItem.appendChild(urlElement);
            
            resultsDiv.appendChild(resultItem);
        });
    } catch (error) {
        console.error('Error rendering results:', error);
        resultsDiv.innerHTML = '<div class="error-message">Error displaying results</div>';
    }
}

// Statistics rendering with improved formatting
function renderStatistics(stats) {
    const statsDiv = document.getElementById('searchStats');
    if (!statsDiv) {
        console.error('Statistics container not found');
        return;
    }

    statsDiv.innerHTML = '';
    
    if (!stats || stats.length === 0) {
        statsDiv.innerHTML = '<div class="no-stats">No search statistics available</div>';
        return;
    }

    try {
        const table = document.createElement('table');
        table.className = 'stats-table';
        
        // Add header
        const header = document.createElement('tr');
        header.innerHTML = `
            <th>Search Term</th>
            <th>Count</th>
            <th>Last Searched</th>
        `;
        table.appendChild(header);
        
        // Add rows
        stats.forEach(stat => {
            const row = document.createElement('tr');
            const timestamp = new Date(stat.timestamp).toLocaleString();
            row.innerHTML = `
                <td>${stat.term}</td>
                <td>${stat.count}</td>
                <td>${timestamp}</td>
            `;
            table.appendChild(row);
        });
        
        statsDiv.appendChild(table);
    } catch (error) {
        console.error('Error rendering statistics:', error);
        statsDiv.innerHTML = '<div class="error-message">Error displaying statistics</div>';
    }
}

// Export functions to global scope
window.sendSearchString = sendSearchString;
window.backToHomePage = backToHomePage;
window.openIndexeditorPage = openIndexeditorPage;
window.openStatisticsScreen = openStatisticsScreen;
window.validateAdmin = validateAdmin;
window.renderResults_title_link = renderResults_title_link;
window.renderStatistics = renderStatistics;
