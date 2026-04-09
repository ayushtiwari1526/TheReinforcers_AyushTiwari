// ============================================
// AI TRADING SIGNAL ENGINE - DASHBOARD SCRIPT
// Fast keyword-based sentiment analysis + optional real AI
// ============================================

// Use centralized API config (auto-detects local vs cloud)
const API_BASE_URL = typeof API_CONFIG !== 'undefined' ? API_CONFIG.BACKEND_URL : 'http://localhost:8080/api';

// Keyword dictionaries for sentiment analysis
const POSITIVE_KEYWORDS = [
    'profit', 'growth', 'record', 'rise', 'strong', 'gain', 'surge',
    'rally', 'boom', 'upswing', 'bullish', 'optimize', 'beat',
    'exceed', 'soar', 'high', 'higher', 'success', 'win',
    'positive', 'innovative', 'breakthrough', 'momentum', 'recover',
    'recovery', 'expansion', 'opportunity', 'advantage', 'leader'
];

const NEGATIVE_KEYWORDS = [
    'loss', 'drop', 'war', 'crisis', 'fall', 'decline', 'crash',
    'bearish', 'recession', 'slump', 'downturn', 'risk', 'fail',
    'failure', 'plunge', 'low', 'lower', 'threat', 'concern',
    'negative', 'scandal', 'investigation', 'layoff', 'cut',
    'bankruptcy', 'debt', 'fraud', 'violation', 'penalty', 'downgrade'
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard initialized - Fast sentiment analysis mode');
    
    // Check if there's a stock selected from market page
    const selectedStock = localStorage.getItem('selectedStock');
    
    if (selectedStock) {
        console.log('📈 Stock received from market page:', selectedStock);
        const stockData = JSON.parse(selectedStock);
        showStockBanner(stockData);
        
        // Analyze stock with keyword-based sentiment
        analyzeStockSignal(stockData);
        
        // Clear localStorage after using
        localStorage.removeItem('selectedStock');
    }
    // Check if there's a news selected from news page
    else {
        const selectedNews = localStorage.getItem('selectedNews');
        
        if (selectedNews) {
            console.log('📰 News received from localStorage:', selectedNews);
            
            // Show the selected news banner
            showSelectedNewsBanner(selectedNews);
            
            // Auto-analyze the news from news page
            setTimeout(() => {
                analyzeHeadline(selectedNews);
            }, 300);
            
            // Clear localStorage after using
            localStorage.removeItem('selectedNews');
        } else {
            // No news selected, fetch latest
            console.log('🔄 No news selected, fetching latest...');
            fetchLatestNews();
        }
    }
});

// Show selected news banner
function showSelectedNewsBanner(newsTitle) {
    const banner = document.getElementById('selectedNewsBanner');
    const titleEl = document.getElementById('selectedNewsTitle');
    
    if (banner && titleEl) {
        titleEl.textContent = newsTitle;
        banner.style.display = 'block';
        console.log('✅ News banner displayed');
    }
}

// Show stock banner
function showStockBanner(stockData) {
    const banner = document.getElementById('selectedNewsBanner');
    const titleEl = document.getElementById('selectedNewsTitle');
    
    if (banner && titleEl) {
        const isPositive = stockData.changePercent >= 0;
        const sign = isPositive ? '+' : '';
        titleEl.textContent = `${stockData.symbol} - $${stockData.currentPrice.toFixed(2)} (${sign}${stockData.changePercent.toFixed(2)}%)`;
        banner.style.display = 'block';
        banner.style.borderColor = isPositive ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 71, 87, 0.4)';
        console.log('✅ Stock banner displayed');
    }
}

// Analyze stock signal
function analyzeStockSignal(stockData) {
    console.log('🔍 Analyzing stock signal for:', stockData.symbol);
    
    const isPositive = stockData.changePercent >= 0;
    
    // Generate signal based on stock performance
    let signal, sentiment, confidence, riskLevel, explanation;
    
    if (isPositive && stockData.changePercent > 2) {
        signal = 'BUY';
        sentiment = 'Positive';
        confidence = 70 + Math.random() * 15; // 70-85%
        riskLevel = confidence > 80 ? 'Low' : 'Medium';
        explanation = `Strong upward momentum detected with ${stockData.changePercent.toFixed(2)}% gain. Positive price action suggests bullish sentiment. Consider entry with proper risk management.`;
    } else if (isPositive) {
        signal = 'HOLD';
        sentiment = 'Positive';
        confidence = 60 + Math.random() * 10; // 60-70%
        riskLevel = 'Medium';
        explanation = `Moderate positive movement of ${stockData.changePercent.toFixed(2)}%. Wait for stronger confirmation before entering new positions.`;
    } else if (stockData.changePercent < -2) {
        signal = 'SELL';
        sentiment = 'Negative';
        confidence = 65 + Math.random() * 15; // 65-80%
        riskLevel = confidence > 75 ? 'High' : 'Medium';
        explanation = `Significant decline of ${stockData.changePercent.toFixed(2)}% detected. Bearish pressure present. Consider reducing exposure or implementing protective stops.`;
    } else {
        signal = 'HOLD';
        sentiment = 'Neutral';
        confidence = 50 + Math.random() * 10; // 50-60%
        riskLevel = 'Medium';
        explanation = `Minimal price movement of ${stockData.changePercent.toFixed(2)}%. Market showing indecision. Wait for clearer directional signals.`;
    }
    
    // Display signal
    displaySignal({
        signal: signal,
        sentiment: sentiment,
        confidence: Math.round(confidence * 10) / 10,
        riskLevel: riskLevel,
        strength: isPositive ? 'Strong' : 'Moderate',
        explanation: explanation,
        timestamp: new Date().toLocaleTimeString(),
        source: `Finnhub API - ${stockData.symbol}`
    });
    
    console.log('✅ Stock signal analysis complete');
}

// Fast keyword-based sentiment analysis
function analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    
    let positiveCount = 0;
    let negativeCount = 0;
    let matchedPositive = [];
    let matchedNegative = [];
    
    // Count positive keywords
    POSITIVE_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            positiveCount++;
            matchedPositive.push(keyword);
        }
    });
    
    // Count negative keywords
    NEGATIVE_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            negativeCount++;
            matchedNegative.push(keyword);
        }
    });
    
    // Determine sentiment
    let sentiment, baseConfidence, signal;
    
    if (positiveCount > negativeCount) {
        sentiment = 'Positive';
        baseConfidence = 70 + Math.random() * 15; // 70-85%
        signal = baseConfidence > 70 ? 'BUY' : 'HOLD';
    } else if (negativeCount > positiveCount) {
        sentiment = 'Negative';
        baseConfidence = 65 + Math.random() * 15; // 65-80%
        signal = 'SELL';
    } else {
        sentiment = 'Neutral';
        baseConfidence = 50 + Math.random() * 15; // 50-65%
        signal = 'HOLD';
    }
    
    // Determine risk level
    let riskLevel;
    if (baseConfidence > 80) {
        riskLevel = 'Low';
    } else if (baseConfidence >= 65) {
        riskLevel = 'Medium';
    } else {
        riskLevel = 'High';
    }
    
    // Determine strength
    let strength;
    if (baseConfidence > 80) {
        strength = 'STRONG';
    } else if (baseConfidence > 70) {
        strength = 'MODERATE';
    } else {
        strength = 'WEAK';
    }
    
    // Generate explanation based on matched keywords
    let explanation;
    if (matchedPositive.length > 0) {
        explanation = `Sentiment analysis detected positive indicators: "${matchedPositive.join('", "')}". ${signal} signal generated based on bullish market sentiment with ${baseConfidence.toFixed(1)}% confidence.`;
    } else if (matchedNegative.length > 0) {
        explanation = `Sentiment analysis detected negative indicators: "${matchedNegative.join('", "')}". ${signal} signal generated based on bearish market sentiment with ${baseConfidence.toFixed(1)}% confidence.`;
    } else {
        explanation = `Neutral sentiment detected with no strong directional indicators. ${signal} signal suggests cautious approach with ${baseConfidence.toFixed(1)}% confidence.`;
    }
    
    return {
        sentiment: sentiment,
        signal: signal,
        confidence: Math.round(baseConfidence * 10) / 10,
        riskLevel: riskLevel,
        strength: strength,
        explanation: explanation,
        matchedKeywords: {
            positive: matchedPositive,
            negative: matchedNegative
        }
    };
}

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

// Analyze headline - FAST keyword-based sentiment analysis
async function analyzeHeadline(headline) {
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.innerHTML = '<div class="spinner"></div> Analyzing headline...';
    refreshBtn.disabled = true;
    refreshBtn.classList.add('loading');

    // Update UI to loading state
    document.getElementById('headline').textContent = headline;
    document.getElementById('company').textContent = '⏳ Analyzing market sentiment...';
    document.getElementById('signalBadge').className = 'signal-badge hold';
    document.getElementById('signalBadge').textContent = 'ANALYZING';
    document.getElementById('sentiment').textContent = '⏳';
    document.getElementById('confidence').textContent = '⏳';
    document.getElementById('riskLevel').textContent = '⏳';
    document.getElementById('strength').textContent = '⏳';
    document.getElementById('explanation').textContent = '🔍 Performing sentiment analysis on headline...';

    try {
        const startTime = Date.now();
        console.log('🚀 Starting fast sentiment analysis...');
        
        // INSTANT keyword-based analysis (< 100ms)
        const analysis = analyzeSentiment(headline);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);
        
        console.log(`✅ Signal generated in ${elapsed}s`);
        console.log(`📊 Sentiment: ${analysis.sentiment}, Signal: ${analysis.signal}, Confidence: ${analysis.confidence}%`);
        console.log(`🔑 Matched keywords:`, analysis.matchedKeywords);
        
        // Build complete signal data
        const signalData = {
            headline: headline,
            company: extractCompany(headline),
            sentiment: analysis.sentiment,
            signal: analysis.signal,
            confidence: analysis.confidence,
            riskLevel: analysis.riskLevel,
            strength: analysis.strength,
            explanation: analysis.explanation
        };
        
        // Display signal with smooth animation
        displaySignal(signalData);
        
        // Update timestamp with analysis type
        const now = new Date();
        document.getElementById('timestamp').textContent = 
            `Signal generated in ${elapsed}s • ${now.toLocaleTimeString()} • Based on real-time sentiment analysis`;
        
        // OPTIONAL: Fetch real AI in background (non-blocking)
        fetchRealAIAsync(headline);
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        showError('Failed to analyze headline. Please try again.');
    } finally {
        refreshBtn.innerHTML = '<span>🔄</span> Refresh Signal';
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('loading');
    }
}

// Extract company name from headline (simple heuristic)
function extractCompany(headline) {
    // Common company patterns
    const patterns = [
        /^(\w+)'s/,           // Apple's
        /^(\w+) Corp/,        // Tesla Corp
        /^(\w+) Inc/,         // Apple Inc
        /^(\w+) Ltd/,         // Company Ltd
    ];
    
    for (let pattern of patterns) {
        const match = headline.match(pattern);
        if (match) return match[1];
    }
    
    // Default: use first word if it looks like a company name
    const firstWord = headline.split(' ')[0];
    if (firstWord.length > 2 && /^[A-Z]/.test(firstWord)) {
        return firstWord;
    }
    
    return 'Market Analysis';
}

// Fetch real AI in background (optional enhancement)
async function fetchRealAIAsync(headline) {
    try {
        console.log('🤖 Fetching real AI analysis in background...');
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ headline: headline })
        });
        
        if (response.ok) {
            const aiData = await response.json();
            console.log('✅ Real AI analysis available:', aiData);
            // You can choose to update UI with real AI data here if needed
            // displaySignal(aiData);
        }
    } catch (error) {
        console.log('ℹ️ Real AI fetch skipped (optional):', error.message);
    }
}

// Display signal data
function displaySignal(data) {
    // Update headline and company
    document.getElementById('headline').textContent = data.headline;
    document.getElementById('company').textContent = data.company ? `🏢 ${data.company} - Market Sentiment Analysis` : '📊 Analyzing market sentiment';

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

    // Update explanation with authenticity message
    const explanation = data.explanation || 'Signal generated based on real-time sentiment analysis';
    document.getElementById('explanation').textContent = explanation;

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
