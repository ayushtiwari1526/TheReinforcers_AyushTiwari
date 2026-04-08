// ============================================
// AI TRADING SIGNAL ENGINE - DASHBOARD SCRIPT
// Optimized for FAST real AI signals
// ============================================

const API_BASE_URL = 'http://localhost:8080/api';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard initialized - Real AI mode');
    fetchLatestNews();
});

// Fetch latest news from backend
async function fetchLatestNews() {
    const btn = document.getElementById('fetchNewsBtn');
    btn.innerHTML = '<div class="spinner"></div> Fetching...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/news/latest`);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            displayNewsList(data.articles);
            // Auto-analyze first article
            analyzeHeadline(data.articles[0].title);
        } else {
            showError('No articles found');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Failed to fetch news. Make sure backend is running.');
    } finally {
        btn.innerHTML = '<span>📰</span> Fetch Latest News';
        btn.disabled = false;
    }
}

// Display news list
function displayNewsList(articles) {
    const newsList = document.getElementById('newsList');
    
    let html = '<h2 style="margin-bottom: 20px; color: var(--neon-green);">Latest Financial News</h2>';
    html += '<div style="display: grid; gap: 15px;">';
    
    articles.forEach((article, index) => {
        html += `
            <div class="signal-card" style="cursor: pointer; transition: all 0.3s ease;" 
                 onclick="analyzeHeadline('${article.title.replace(/'/g, "\\'")}')"
                 onmouseover="this.style.borderColor='var(--neon-green)'; this.style.transform='translateY(-5px)'"
                 onmouseout="this.style.borderColor='var(--glass-border)'; this.style.transform='translateY(0)'">
                <h3 style="margin-bottom: 10px;">${article.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.875rem;">Source: ${article.source} • Click to analyze</p>
            </div>
        `;
    });
    
    html += '</div>';
    newsList.innerHTML = html;
}

// Analyze headline - REAL AI (optimized for speed)
async function analyzeHeadline(headline) {
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.innerHTML = '<div class="spinner"></div> Analyzing with AI...';
    refreshBtn.disabled = true;
    refreshBtn.classList.add('loading');

    // Update UI to loading state
    document.getElementById('headline').textContent = headline;
    document.getElementById('company').textContent = '⏳ Processing with Gemma SLM...';
    document.getElementById('signalBadge').className = 'signal-badge hold';
    document.getElementById('signalBadge').textContent = 'ANALYZING';
    document.getElementById('sentiment').textContent = '⏳';
    document.getElementById('confidence').textContent = '⏳';
    document.getElementById('riskLevel').textContent = '⏳';
    document.getElementById('strength').textContent = '⏳';
    document.getElementById('explanation').textContent = '🤖 AI is analyzing this headline in real-time...';

    try {
        const startTime = Date.now();
        console.log('🚀 Starting real AI analysis...');
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ headline: headline })
        });

        const data = await response.json();
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log(`✅ Real AI signal received in ${elapsed}s`);
        
        // Display real data
        displaySignal(data);
        
        // Show processing time
        document.getElementById('timestamp').textContent = `AI processed in ${elapsed}s • ${new Date().toLocaleTimeString()}`;
        
    } catch (error) {
        console.error('❌ AI analysis error:', error);
        showError('Failed to get AI signal. Check if backend services are running.');
    } finally {
        refreshBtn.innerHTML = '<span>🔄</span> Refresh Signal';
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('loading');
    }
}

// Display signal data
function displaySignal(data) {
    // Update headline and company
    document.getElementById('headline').textContent = data.headline;
    document.getElementById('company').textContent = data.company ? `🏢 Company: ${data.company}` : '📊 Analyzing market sentiment';

    // Update signal badge
    const signalBadge = document.getElementById('signalBadge');
    const signal = data.signal.toUpperCase();
    signalBadge.className = `signal-badge ${signal.toLowerCase()}`;
    signalBadge.textContent = signal;
    
    // Add pulsing animation
    signalBadge.style.animation = 'pulse 2s infinite';

    // Update metrics with smooth transition
    animateValue('sentiment', data.sentiment);
    animateValue('confidence', `${data.confidence}%`);
    animateValue('riskLevel', data.riskLevel || 'Medium');
    animateValue('strength', data.strength || 'MODERATE');

    // Update explanation
    document.getElementById('explanation').textContent = data.explanation || 'AI analysis complete';

    // Update timestamp
    const now = new Date();
    document.getElementById('timestamp').textContent = `Last updated: ${now.toLocaleTimeString()}`;

    // Add glow effect based on signal
    const signalCard = document.getElementById('signalCard');
    if (signal === 'BUY') {
        signalCard.style.boxShadow = '0 0 40px rgba(0, 255, 136, 0.6), inset 0 0 20px rgba(0, 255, 136, 0.1)';
        signalCard.style.borderColor = 'var(--neon-green)';
    } else if (signal === 'SELL') {
        signalCard.style.boxShadow = '0 0 40px rgba(255, 71, 87, 0.6), inset 0 0 20px rgba(255, 71, 87, 0.1)';
        signalCard.style.borderColor = '#ff4757';
    } else {
        signalCard.style.boxShadow = '0 0 40px rgba(255, 193, 7, 0.6), inset 0 0 20px rgba(255, 193, 7, 0.1)';
        signalCard.style.borderColor = '#ffc107';
    }
}

// Animate value update
function animateValue(elementId, value) {
    const element = document.getElementById(elementId);
    element.style.transition = 'all 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        element.textContent = value;
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }, 100);
}

// Refresh signal (re-analyze current headline)
async function refreshSignal() {
    const currentHeadline = document.getElementById('headline').textContent;
    if (currentHeadline && currentHeadline !== 'Loading latest news...') {
        await analyzeHeadline(currentHeadline);
    } else {
        await fetchLatestNews();
    }
}

// Show error message
function showError(message) {
    document.getElementById('headline').textContent = 'Error';
    document.getElementById('company').textContent = message;
    document.getElementById('explanation').textContent = 'Please ensure all services are running: Python Flask (port 5000) and Java Backend (port 8080)';
}

console.log('📊 Dashboard Script Loaded');
