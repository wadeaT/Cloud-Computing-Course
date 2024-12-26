// Search functionality
function sendSearchString() {
    const searchText = document.getElementById('searchbartext').value;
    if (searchText.trim() !== '') {
        google.colab.kernel.invokeFunction('notebook.receive_search_string', [searchText], {});
    }
}

// Handle enter key in search box
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchbartext');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendSearchString();
            }
        });
    }
});

// Navigation functions
function backToHomePage() {
    google.colab.kernel.invokeFunction('notebook.back_to_home_page', [], {});
}

function openIndexeditorPage() {
    google.colab.kernel.invokeFunction('notebook.open_indexeditor_page', [], {});
}

function openStatisticsScreen() {
    google.colab.kernel.invokeFunction('notebook.open_statistics_screen', [], {});
}

// Admin functionality
function validateAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === '123456') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
    } else {
        alert('Invalid password. Please try again.');
    }
}

// Results rendering
function renderResults_title_link(titles, links, texts, queryCount) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!titles || titles.length === 0) {
        resultsDiv.innerHTML = '<div class="result-item">No results found</div>';
        return;
    }

    // Add query count
    const countDiv = document.createElement('div');
    countDiv.className = 'query-count';
    countDiv.textContent = `Found ${queryCount} matches`;
    resultsDiv.appendChild(countDiv);

    // Add results
    titles.forEach((title, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const titleElement = document.createElement('h3');
        const linkElement = document.createElement('a');
        linkElement.href = links[index];
        linkElement.target = '_blank';
        linkElement.textContent = title;
        titleElement.appendChild(linkElement);
        
        const textElement = document.createElement('p');
        textElement.textContent = texts[index];
        
        const urlElement = document.createElement('small');
        urlElement.textContent = links[index];
        
        resultItem.appendChild(titleElement);
        resultItem.appendChild(textElement);
        resultItem.appendChild(urlElement);
        
        resultsDiv.appendChild(resultItem);
    });
}

// Statistics rendering
function renderStatistics(stats) {
    const statsDiv = document.getElementById('searchStats');
    if (!statsDiv) return;

    statsDiv.innerHTML = '';
    
    if (!stats || stats.length === 0) {
        statsDiv