// ============================================
// NEWS PAGE SCRIPT
// Fetch and display financial news
// ============================================

const API_BASE_URL = 'http://localhost:8080/api';
let currentPage = 1;
let allLoadedNews = [];
const NEWS_PER_PAGE = 9;

// Initialize news page - WAIT FOR DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📰 News page initialized');
    
    // Safety check: wait a tiny bit to ensure everything is loaded
    setTimeout(() => {
        // Load sample news immediately so page is never empty
        console.log('📊 Loading sample news...');
        allLoadedNews = getSampleNews();
        displayNewsCards(allLoadedNews.slice(0, NEWS_PER_PAGE));
        
        // Show "Load More" button if we have more news
        updateLoadMoreButton();
        
        // DON'T auto-fetch from API - only fetch when user clicks Refresh button
        console.log('✅ News loaded. Click "Refresh News" to fetch latest from API');
    }, 100);
});

// Fetch latest news from backend
async function fetchLatestNews() {
    const btn = document.getElementById('refreshNewsBtn');
    if (btn) {
        btn.innerHTML = '<div class="spinner-small"></div> Fetching...';
        btn.disabled = true;
    }

    try {
        console.log('🔄 Fetching news from API...');
        const response = await fetch(`${API_BASE_URL}/news/latest`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ API response received:', data);

        if (data.articles && data.articles.length > 0) {
            console.log(`📊 Got ${data.articles.length} articles from API`);
            allLoadedNews = data.articles;
            currentPage = 1;
            
            // Show first page
            displayNewsCards(allLoadedNews.slice(0, NEWS_PER_PAGE));
            updateLoadMoreButton();
        } else {
            console.log('⚠️ No articles in API response, keeping sample news');
        }
    } catch (error) {
        console.error('❌ Error fetching news:', error);
        console.log('ℹ️ Keeping sample news as fallback');
        // Keep the sample news that's already displayed
    } finally {
        if (btn) {
            btn.innerHTML = '<span>🔄</span> Refresh News';
            btn.disabled = false;
        }
    }
}

// Display news cards
function displayNewsCards(articles) {
    const newsGrid = document.getElementById('newsGrid');
    
    if (!newsGrid) {
        console.error('❌ newsGrid element not found!');
        return;
    }
    
    let html = '';

    articles.forEach((article, index) => {
        const delay = index * 0.1;
        // Escape quotes properly for onclick
        const escapedTitle = article.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="news-card" style="animation: fadeIn 0.5s ease ${delay}s both;">
                <div class="news-card-header">
                    <span class="news-source">📰 ${article.source || 'Financial News'}</span>
                    <span class="news-time">${article.publishedAt || 'Recent'}</span>
                </div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${article.description || 'Click analyze to get AI-powered trading signal for this news headline.'}</p>
                <div class="news-card-footer">
                    <button class="btn-analyze" onclick="analyzeNews('${escapedTitle}')">
                        <span>⚡</span> Analyze with AI
                    </button>
                </div>
            </div>
        `;
    });

    newsGrid.innerHTML = html;
    console.log(`✅ Displayed ${articles.length} news cards`);
}

// Analyze news - redirect to dashboard
function analyzeNews(newsTitle) {
    console.log('🔍 Analyzing:', newsTitle);
    
    // Store selected news in localStorage
    localStorage.setItem('selectedNews', newsTitle);
    localStorage.setItem('analysisTimestamp', new Date().toISOString());
    
    // Show loading feedback
    const btn = event.target.closest('.btn-analyze');
    if (btn) {
        btn.innerHTML = '<div class="spinner-small"></div> Analyzing...';
        btn.disabled = true;
    }
    
    // Redirect to dashboard after brief delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

// Sample news for fallback
function getSampleNews() {
    return [
        {
            title: "Apple's profit growth exceeds expectations in Q4 earnings report",
            source: "Reuters",
            description: "Apple Inc reported stronger-than-expected quarterly profits driven by robust iPhone sales.",
            publishedAt: "2 hours ago"
        },
        {
            title: "Tesla stock surges on record vehicle deliveries and expansion plans",
            source: "Bloomberg",
            description: "Tesla shares jumped after the company announced record quarterly deliveries.",
            publishedAt: "4 hours ago"
        },
        {
            title: "Microsoft faces crisis as cloud services experience major outage",
            source: "CNBC",
            description: "Microsoft Azure experienced widespread disruptions affecting thousands of businesses.",
            publishedAt: "6 hours ago"
        },
        {
            title: "Amazon announces breakthrough in AI technology for e-commerce",
            source: "TechCrunch",
            description: "Amazon unveils new AI-powered shopping assistant to enhance customer experience.",
            publishedAt: "8 hours ago"
        },
        {
            title: "Google parent Alphabet reports decline in advertising revenue",
            source: "Financial Times",
            description: "Alphabet's quarterly results show weakening demand in digital advertising market.",
            publishedAt: "10 hours ago"
        },
        {
            title: "NVIDIA stock hits record high on strong demand for AI chips",
            source: "Wall Street Journal",
            description: "NVIDIA reaches new all-time high as data center revenue continues explosive growth.",
            publishedAt: "12 hours ago"
        },
        {
            title: "Federal Reserve maintains interest rates amid economic uncertainty",
            source: "Reuters",
            description: "The Fed keeps rates steady as inflation shows signs of cooling.",
            publishedAt: "14 hours ago"
        },
        {
            title: "Meta Platforms invests heavily in metaverse despite losses",
            source: "Bloomberg",
            description: "Meta continues massive spending on virtual reality division despite investor concerns.",
            publishedAt: "16 hours ago"
        },
        {
            title: "Bitcoin drops sharply as regulatory concerns increase globally",
            source: "CoinDesk",
            description: "Cryptocurrency markets face pressure as governments announce stricter regulations.",
            publishedAt: "18 hours ago"
        },
        {
            title: "Intel announces major chip manufacturing expansion in United States",
            source: "Reuters",
            description: "Intel plans to invest $20 billion in new semiconductor fabrication plants.",
            publishedAt: "20 hours ago"
        },
        {
            title: "Oil prices fall as global demand shows signs of weakening",
            source: "Bloomberg",
            description: "Crude oil prices dropped 3% amid concerns over economic slowdown.",
            publishedAt: "22 hours ago"
        },
        {
            title: "JPMorgan reports record quarterly revenue from investment banking",
            source: "CNBC",
            description: "JPMorgan Chase exceeded analyst expectations with strong trading results.",
            publishedAt: "1 day ago"
        },
        {
            title: "SpaceX valuation soars after successful satellite launch mission",
            source: "TechCrunch",
            description: "SpaceX reaches $150 billion valuation following latest achievement.",
            publishedAt: "1 day ago"
        },
        {
            title: "European markets decline on inflation data concerns",
            source: "Financial Times",
            description: "European stocks fell as inflation numbers came in higher than expected.",
            publishedAt: "1 day ago"
        },
        {
            title: "Salesforce acquires AI startup for $2 billion to boost capabilities",
            source: "Wall Street Journal",
            description: "Salesforce continues AI acquisition spree with latest strategic purchase.",
            publishedAt: "1 day ago"
        },
        {
            title: "Gold prices surge to new highs as investors seek safe haven assets",
            source: "Reuters",
            description: "Gold reaches $2,100 per ounce amid market volatility and geopolitical tensions.",
            publishedAt: "2 days ago"
        },
        {
            title: "Twitter rebrands to X as Musk pushes super app vision",
            source: "Bloomberg",
            description: "Elon Musk's transformation of Twitter continues with major rebranding effort.",
            publishedAt: "2 days ago"
        }
    ];
}

// Load more news
function loadMoreNews() {
    console.log('📰 Loading more news...');
    currentPage++;
    
    const startIndex = 0;
    const endIndex = currentPage * NEWS_PER_PAGE;
    const newsToShow = allLoadedNews.slice(startIndex, endIndex);
    
    displayNewsCards(newsToShow);
    updateLoadMoreButton();
    
    console.log(`✅ Showing ${newsToShow.length} of ${allLoadedNews.length} articles`);
}

// Update Load More button visibility
function updateLoadMoreButton() {
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!loadMoreBtn) {
        // Create button if it doesn't exist
        const pageContainer = document.querySelector('.page-container');
        if (pageContainer) {
            loadMoreBtn = document.createElement('button');
            loadMoreBtn.id = 'loadMoreBtn';
            loadMoreBtn.className = 'btn-load-more';
            loadMoreBtn.innerHTML = '<span>📰</span> Load More News';
            loadMoreBtn.onclick = loadMoreNews;
            pageContainer.appendChild(loadMoreBtn);
        }
    }
    
    if (loadMoreBtn) {
        const shownCount = currentPage * NEWS_PER_PAGE;
        const hasMore = shownCount < allLoadedNews.length;
        
        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            const remaining = allLoadedNews.length - shownCount;
            loadMoreBtn.innerHTML = `<span>📰</span> Load More News (${remaining} remaining)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

console.log('📰 News Script Loaded');
