// ==========================================
// AI TRADING SIGNAL ENGINE - PREMIUM JavaScript
// ==========================================

// DOM Elements
const newsInput = document.getElementById('newsInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultCard = document.getElementById('resultCard');
const charCount = document.querySelector('.char-count');
const loaderProgressBar = document.getElementById('loaderProgressBar');
const fetchNewsBtn = document.getElementById('fetchNewsBtn');
const newsList = document.getElementById('newsList');

// Backend API URL
const BACKEND_URL = 'http://localhost:8080/api';

// Result Elements
const companyBadge = document.getElementById('companyBadge');
const companyName = document.getElementById('companyName');
const signalBadge = document.getElementById('signalBadge');
const signalIcon = document.getElementById('signalIcon');
const signalText = document.getElementById('signalText');
const signalSubtitle = document.getElementById('signalSubtitle');
const sentimentValue = document.getElementById('sentimentValue');
const sentimentIndicator = document.getElementById('sentimentIndicator');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceFill = document.getElementById('confidenceFill');
const riskValue = document.getElementById('riskValue');
const riskMeter = document.getElementById('riskMeter');
const explanationText = document.getElementById('explanationText');
const keyFactors = document.getElementById('keyFactors');
const miniChart = document.getElementById('miniChart');
const chartLabel = document.getElementById('chartLabel');
const resetBtn = document.getElementById('resetBtn');
const shareBtn = document.getElementById('shareBtn');

// ==========================================
// PARTICLE ANIMATION SYSTEM
// ==========================================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.15;
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

// Initialize particle system
resizeCanvas();
initParticles();
animateParticles();

// Handle resize
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ==========================================
// MINI CHART VISUALIZATION
// ==========================================

function drawMiniChart(signal) {
    const ctx = miniChart.getContext('2d');
    const width = miniChart.width = miniChart.offsetWidth;
    const height = miniChart.height = miniChart.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Generate data points based on signal
    const points = 30;
    const data = [];
    let value = height / 2;
    
    for (let i = 0; i < points; i++) {
        if (signal === 'BUY') {
            value -= Math.random() * 8 + 2; // Upward trend
            value = Math.max(20, value);
        } else if (signal === 'SELL') {
            value += Math.random() * 8 + 2; // Downward trend
            value = Math.min(height - 20, value);
        } else {
            value += (Math.random() - 0.5) * 6; // Flat/slight波动
            value = Math.max(30, Math.min(height - 30, value));
        }
        data.push(value);
    }
    
    // Normalize data to fit canvas
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    
    const normalizedData = data.map(val => 
        ((val - minVal) / range) * (height - 40) + 20
    );
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Determine color
    let color, gradientColors;
    if (signal === 'BUY') {
        color = '#00ff88';
        gradientColors = ['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0)'];
    } else if (signal === 'SELL') {
        color = '#ff4757';
        gradientColors = ['rgba(255, 71, 87, 0.3)', 'rgba(255, 71, 87, 0)'];
    } else {
        color = '#ffa502';
        gradientColors = ['rgba(255, 165, 2, 0.3)', 'rgba(255, 165, 2, 0)'];
    }
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    normalizedData.forEach((val, i) => {
        const x = (i / (points - 1)) * width;
        if (i === 0) {
            ctx.lineTo(x, val);
        } else {
            const prevX = ((i - 1) / (points - 1)) * width;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, normalizedData[i - 1], cpX, (normalizedData[i - 1] + val) / 2);
        }
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    normalizedData.forEach((val, i) => {
        const x = (i / (points - 1)) * width;
        if (i === 0) {
            ctx.moveTo(x, val);
        } else {
            const prevX = ((i - 1) / (points - 1)) * width;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, normalizedData[i - 1], cpX, (normalizedData[i - 1] + val) / 2);
        }
    });
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw endpoint dot
    const lastX = width;
    const lastY = normalizedData[normalizedData.length - 1];
    
    ctx.beginPath();
    ctx.arc(lastX - 5, lastY, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(lastX - 5, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Update chart label
    const timeLabels = ['1D', '1W', '1M', '3M', '1Y'];
    chartLabel.textContent = `${signal} Signal • ${timeLabels[Math.floor(Math.random() * timeLabels.length)]}`;
}

// ==========================================
// COMPANY DETECTION ENGINE
// ==========================================

function detectCompany(text) {
    const companies = {
        'Tesla': /\b(tesla|tsla|elon musk)\b/i,
        'Apple': /\b(apple|aapl|iphone|tim cook)\b/i,
        'Microsoft': /\b(microsoft|msft|azure|bill gates|satya nadella)\b/i,
        'Amazon': /\b(amazon|amzn|jeff bezos)\b/i,
        'Google': /\b(google|googl|alphabet|sundar pichai)\b/i,
        'Meta': /\b(meta|fb|facebook|mark zuckerberg)\b/i,
        'Netflix': /\b(netflix|nflx)\b/i,
        'NVIDIA': /\b(nvidia|nvda|gpu|jen-hsun huang)\b/i,
        'Reliance': /\b(reliance|ril|mukesh ambani)\b/i,
        'Tata': /\b(tata|tcs|tata motors)\b/i,
        'Infosys': /\b(infosys|infy)\b/i,
        'Wipro': /\b(wipro)\b/i,
        'JPMorgan': /\b(jpmorgan|jpm|jp morgan)\b/i,
        'Goldman Sachs': /\b(goldman sachs|gs)\b/i,
        'Bank of America': /\b(bank of america|bac|bofa)\b/i,
        'Walmart': /\b(walmart|wmt)\b/i,
        'Disney': /\b(disney|dis)\b/i,
        'Uber': /\b(uber)\b/i,
        'Airbnb': /\b(airbnb)\b/i,
        'SpaceX': /\b(spacex|starlink)\b/i,
        'Bitcoin': /\b(bitcoin|btc|crypto)\b/i,
        'TCS': /\b(tcs|tata consultancy)\b/i
    };
    
    for (const [company, pattern] of Object.entries(companies)) {
        if (pattern.test(text)) {
            return company;
        }
    }
    
    return null;
}

// ==========================================
// KEYWORD EXTRACTION
// ==========================================

function extractKeyFactors(text, posWords, negWords) {
    const factors = [];
    const lowerText = text.toLowerCase();
    
    // Detect positive factors
    const positiveFactors = {
        'Strong Earnings': /\b(earnings|profit|revenue)\b.*\b(grow|increase|beat|surge|rise)\b/i,
        'Market Growth': /\b(market|sector|industry)\b.*\b(grow|expand|boom)\b/i,
        'Investor Confidence': /\b(investor|market)\b.*\b(confidence|optimism|bullish)\b/i,
        'Innovation': /\b(innovation|breakthrough|technology|launch)\b/i,
        'Analyst Upgrade': /\b(upgrade|upgrade|outperform|overweight)\b/i,
        'Record Performance': /\b(record|all-time high|ath|surge)\b/i
    };
    
    // Detect negative factors
    const negativeFactors = {
        'Revenue Decline': /\b(revenue|earnings|profit)\b.*\b(decline|fall|drop|miss)\b/i,
        'Market Concerns': /\b(concern|fear|risk|uncertainty)\b/i,
        'Regulatory Issues': /\b(regulation|investigation|fine|penalty)\b/i,
        'Competition Pressure': /\b(competition|competitive|pressure)\b/i,
        'Analyst Downgrade': /\b(downgrade|underperform|sell)\b/i,
        'Economic Slowdown': /\b(recession|slowdown|contraction)\b/i
    };
    
    // Check positive factors
    for (const [factor, pattern] of Object.entries(positiveFactors)) {
        if (pattern.test(text)) {
            factors.push(factor);
            if (factors.length >= 3) break;
        }
    }
    
    // Check negative factors
    if (factors.length === 0) {
        for (const [factor, pattern] of Object.entries(negativeFactors)) {
            if (pattern.test(text)) {
                factors.push(factor);
                if (factors.length >= 3) break;
            }
        }
    }
    
    // Default factors if none detected
    if (factors.length === 0) {
        if (posWords > 0) {
            factors.push('Positive Sentiment', 'Bullish Indicators');
        } else if (negWords > 0) {
            factors.push('Negative Sentiment', 'Bearish Indicators');
        } else {
            factors.push('Neutral Outlook', 'Mixed Signals');
        }
    }
    
    return factors.slice(0, 3);
}

// ==========================================
// INPUT HANDLING
// ==========================================

// Character counter and button state
newsInput.addEventListener('input', () => {
    const length = newsInput.value.length;
    charCount.textContent = `${length}/500`;
    
    // Enable/disable button based on input
    if (length > 0) {
        analyzeBtn.disabled = false;
        charCount.style.color = 'var(--neon-green)';
    } else {
        analyzeBtn.disabled = true;
        charCount.style.color = 'var(--text-muted)';
    }
});

// ==========================================
// SENTIMENT ANALYSIS ENGINE (ENHANCED)
// ==========================================

function analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    
    // Positive keywords
    const positiveWords = [
        'profit', 'growth', 'surge', 'gain', 'rally', 'bullish', 'upswing', 
        'boom', 'record', 'higher', 'rise', 'recovery', 'optimistic', 'positive',
        'beat', 'exceeded', 'strong', 'upbeat', 'momentum', 'breakthrough',
        'success', 'soar', 'jump', 'advance', 'climb', 'improve', 'expansion',
        'innovation', 'upgrade', 'outperform', 'all-time high'
    ];
    
    // Negative keywords
    const negativeWords = [
        'loss', 'decline', 'crash', 'drop', 'bearish', 'fall', 'recession',
        'down', 'lower', 'weak', 'negative', 'missed', 'below', 'disappointing',
        'concern', 'risk', 'fear', 'panic', 'sell-off', 'slump', 'plunge',
        'decrease', 'downturn', 'contraction', 'deficit', 'bankruptcy',
        'downgrade', 'underperform', 'investigation', 'fine', 'penalty'
    ];
    
    // Calculate sentiment scores
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
        if (lowerText.includes(word)) {
            positiveScore++;
        }
    });
    
    negativeWords.forEach(word => {
        if (lowerText.includes(word)) {
            negativeScore++;
        }
    });
    
    // Determine sentiment
    let sentiment, signal, icon, color;
    
    if (positiveScore > negativeScore) {
        sentiment = 'Positive';
        signal = 'BUY';
        icon = '🚀';
        color = 'buy';
    } else if (negativeScore > positiveScore) {
        sentiment = 'Negative';
        signal = 'SELL';
        icon = '📉';
        color = 'sell';
    } else {
        sentiment = 'Neutral';
        signal = 'HOLD';
        icon = '⚖️';
        color = 'hold';
    }
    
    // Generate confidence score (70-95%)
    const baseConfidence = 75;
    const keywordBonus = Math.min(20, (positiveScore + negativeScore) * 3);
    const confidence = Math.min(95, baseConfidence + keywordBonus + Math.floor(Math.random() * 10));
    
    // Generate risk level
    let riskLevel;
    if (confidence > 85) {
        riskLevel = 'Low';
    } else if (confidence > 75) {
        riskLevel = 'Medium';
    } else {
        riskLevel = 'High';
    }
    
    // Generate explanation
    const explanation = generateExplanation(signal, sentiment, positiveScore, negativeScore, lowerText);
    
    // Extract key factors
    const factors = extractKeyFactors(text, positiveScore, negativeScore);
    
    // Detect company
    const company = detectCompany(text);
    
    return {
        sentiment,
        signal,
        icon,
        color,
        confidence,
        riskLevel,
        explanation,
        factors,
        company
    };
}

// Generate dynamic explanations
function generateExplanation(signal, sentiment, posCount, negCount, text) {
    if (signal === 'BUY') {
        const explanations = [
            `Strong bullish indicators detected. Market sentiment shows ${sentiment.toLowerCase()} momentum with ${posCount} positive signal${posCount > 1 ? 's' : ''} identified. Consider accumulating positions with proper risk management.`,
            `AI model detected ${posCount} positive catalyst${posCount > 1 ? 's' : ''} in the news. Historical patterns suggest upward price movement. Confidence level supports a BUY signal with controlled exposure.`,
            `Positive sentiment dominates with ${posCount} bullish keyword${posCount > 1 ? 's' : ''} identified. Market psychology favors upward trajectory. Entry point looks favorable for long positions.`
        ];
        return explanations[Math.floor(Math.random() * explanations.length)];
    } else if (signal === 'SELL') {
        const explanations = [
            `Bearish signals detected with ${negCount} negative indicator${negCount > 1 ? 's' : ''} identified. Risk-off sentiment prevailing. Consider reducing exposure or implementing protective hedges.`,
            `AI analysis reveals ${negCount} bearish catalyst${negCount > 1 ? 's' : ''} in the news flow. Downward pressure likely. Defensive positioning recommended to protect capital.`,
            `Negative sentiment dominates with ${negCount} risk factor${negCount > 1 ? 's' : ''} identified. Market psychology suggests caution. SELL signal triggered based on sentiment breakdown.`
        ];
        return explanations[Math.floor(Math.random() * explanations.length)];
    } else {
        const explanations = [
            `Mixed signals detected with balanced positive and negative indicators. Market awaiting clearer direction. HOLD current positions and monitor for breakout signals.`,
            `Neutral sentiment prevails. AI model identifies conflicting signals (${posCount} positive vs ${negCount} negative). Wait for stronger catalyst before taking action.`,
            `Indecisive market conditions detected. Neither bulls nor bears in control. HOLD strategy recommended until clearer trend emerges.`
        ];
        return explanations[Math.floor(Math.random() * explanations.length)];
    }
}

// ==========================================
// UI INTERACTION HANDLERS (ENHANCED)
// ==========================================

analyzeBtn.addEventListener('click', async () => {
    const text = newsInput.value.trim();
    
    if (!text) return;
    
    // Show loading overlay with progress animation
    await showLoading();
    
    // Analyze sentiment
    const result = analyzeSentiment(text);
    
    // Display results
    displayResults(result);
});

// Show loading animation with progress bar
async function showLoading() {
    loadingOverlay.classList.remove('hidden');
    resultCard.classList.add('hidden');
    
    // Disable button during analysis
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '0.5';
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        loaderProgressBar.style.width = `${progress}%`;
    }, 100);
    
    // Wait for analysis
    await delay(1500);
    
    clearInterval(progressInterval);
    loaderProgressBar.style.width = '100%';
    
    await delay(200);
    loadingOverlay.classList.add('hidden');
    loaderProgressBar.style.width = '0%';
}

// Display analysis results (ENHANCED)
function displayResults(result) {
    // Update company badge
    if (result.company) {
        companyName.textContent = result.company;
        companyBadge.classList.remove('hidden');
    } else {
        companyBadge.classList.add('hidden');
    }
    
    // Update signal badge
    signalBadge.className = 'signal-badge';
    signalBadge.classList.add(result.color);
    signalIcon.textContent = result.icon;
    signalText.textContent = result.signal;
    
    // Set subtitle based on signal
    const subtitles = {
        'BUY': 'Strong bullish signal detected',
        'SELL': 'Bearish warning signal',
        'HOLD': 'Wait for clearer direction'
    };
    signalSubtitle.textContent = subtitles[result.signal];
    
    // Update sentiment
    sentimentValue.textContent = result.sentiment;
    sentimentValue.style.color = getSentimentColor(result.sentiment);
    
    // Update sentiment indicator position
    const indicatorPosition = result.sentiment === 'Positive' ? '90%' : 
                              result.sentiment === 'Negative' ? '10%' : '50%';
    sentimentIndicator.style.setProperty('--indicator-pos', indicatorPosition);
    setTimeout(() => {
        sentimentIndicator.querySelector(':after')?.style.setProperty('left', indicatorPosition);
    }, 100);
    
    // Update confidence
    confidenceValue.textContent = `${result.confidence}%`;
    confidenceFill.style.width = '0%';
    
    setTimeout(() => {
        confidenceFill.style.width = `${result.confidence}%`;
        confidenceFill.style.background = getConfidenceGradient(result.confidence);
    }, 200);
    
    // Update risk level
    riskValue.textContent = result.riskLevel;
    riskValue.style.color = getRiskColor(result.riskLevel);
    
    // Update risk meter
    riskMeter.className = 'risk-meter';
    riskMeter.classList.add(result.riskLevel.toLowerCase());
    riskMeter.innerHTML = '<div class="risk-dot"></div>'.repeat(3);
    
    // Update explanation
    explanationText.textContent = result.explanation;
    
    // Update key factors
    keyFactors.innerHTML = '';
    result.factors.forEach(factor => {
        const tag = document.createElement('div');
        tag.className = 'key-factor-tag';
        tag.textContent = factor;
        keyFactors.appendChild(tag);
    });
    
    // Draw mini chart
    setTimeout(() => {
        drawMiniChart(result.signal);
    }, 300);
    
    // Show result card with animation
    resultCard.classList.remove('hidden');
    
    // Re-enable button
    analyzeBtn.disabled = false;
    analyzeBtn.style.opacity = '1';
    
    // Smooth scroll to results
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Helper: Get sentiment color
function getSentimentColor(sentiment) {
    switch(sentiment) {
        case 'Positive':
            return 'var(--neon-green)';
        case 'Negative':
            return 'var(--neon-red)';
        default:
            return 'var(--neon-yellow)';
    }
}

// Helper: Get confidence gradient
function getConfidenceGradient(confidence) {
    if (confidence >= 85) {
        return 'var(--gradient-green)';
    } else if (confidence >= 75) {
        return 'var(--gradient-yellow)';
    } else {
        return 'var(--gradient-red)';
    }
}

// Helper: Get risk color
function getRiskColor(risk) {
    switch(risk) {
        case 'Low':
            return 'var(--neon-green)';
        case 'Medium':
            return 'var(--neon-yellow)';
        case 'High':
            return 'var(--neon-red)';
        default:
            return 'var(--text-primary)';
    }
}

// Helper: Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// MICRO-INTERACTIONS & RIPPLE EFFECT
// ==========================================

// Button ripple effect
analyzeBtn.addEventListener('click', function(e) {
    const ripple = this.querySelector('.btn-ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('active');
    
    setTimeout(() => ripple.classList.remove('active'), 600);
});

// Reset button
resetBtn.addEventListener('click', () => {
    newsInput.value = '';
    charCount.textContent = '0/500';
    charCount.style.color = 'var(--text-muted)';
    analyzeBtn.disabled = true;
    resultCard.classList.add('hidden');
    companyBadge.classList.add('hidden');
    newsInput.focus();
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Share button
shareBtn.addEventListener('click', async () => {
    const signal = signalText.textContent;
    const sentiment = sentimentValue.textContent;
    const confidence = confidenceValue.textContent;
    const company = companyName.textContent || 'Market';
    
    const shareText = `📊 AI Trading Signal\n\n🏢 ${company}\n🎯 Signal: ${signal}\n📈 Sentiment: ${sentiment}\n📊 Confidence: ${confidence}\n\nGenerated by AI Trading Signal Engine`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'AI Trading Signal',
                text: shareText
            });
        } catch (err) {
            // Fallback to clipboard
            copyToClipboard(shareText);
        }
    } else {
        copyToClipboard(shareText);
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = shareBtn.querySelector('span:last-child').textContent;
        shareBtn.querySelector('span:last-child').textContent = 'Copied!';
        shareBtn.querySelector('.btn-icon-sm').textContent = '✅';
        
        setTimeout(() => {
            shareBtn.querySelector('span:last-child').textContent = originalText;
            shareBtn.querySelector('.btn-icon-sm').textContent = '📤';
        }, 2000);
    });
}

// ==========================================
// BACKEND API INTEGRATION (REAL AI + NEWS)
// ==========================================

// Override analyze button to use backend
analyzeBtn.removeEventListener('click', null);
analyzeBtn.addEventListener('click', async () => {
    const text = newsInput.value.trim();
    
    if (!text) return;
    
    // Analyze with real backend
    await analyzeWithBackend(text);
});

// Analyze with real backend API
async function analyzeWithBackend(headline) {
    try {
        // Show loading
        showLoading();
        
        // Call backend API
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ headline: headline })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Analysis failed');
        }
        
        // Hide loading
        hideLoading();
        
        // Display results
        handleAnalysisResponse(data);
        
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Analysis error:', error);
    }
}

// Handle analysis response from backend
function handleAnalysisResponse(data) {
    // Update company badge
    if (data.company) {
        companyName.textContent = data.company;
        companyBadge.classList.remove('hidden');
    } else {
        companyBadge.classList.add('hidden');
    }
    
    // Update signal badge
    signalBadge.className = 'signal-badge';
    signalBadge.classList.add(data.signal.toLowerCase());
    signalIcon.textContent = data.signal === 'BUY' ? '🚀' : data.signal === 'SELL' ? '📉' : '⚖️';
    signalText.textContent = data.signal;
    signalSubtitle.textContent = data.signalSubtitle || '';
    
    // Update sentiment
    sentimentValue.textContent = data.sentiment;
    sentimentValue.style.color = getSentimentColor(data.sentiment);
    
    // Update sentiment indicator position
    const indicatorPosition = data.sentiment === 'Positive' ? '90%' : 
                              data.sentiment === 'Negative' ? '10%' : '50%';
    setTimeout(() => {
        const indicator = sentimentIndicator;
        if (indicator) {
            indicator.innerHTML = `<div style="position: absolute; left: ${indicatorPosition}; width: 12px; height: 12px; background: white; border-radius: 50%; top: 50%; transform: translateY(-50%); box-shadow: 0 0 10px rgba(255,255,255,0.8); transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);"></div>`;
        }
    }, 100);
    
    // Update confidence
    confidenceValue.textContent = `${data.confidence}%`;
    confidenceFill.style.width = '0%';
    
    setTimeout(() => {
        confidenceFill.style.width = `${data.confidence}%`;
        confidenceFill.style.background = getConfidenceGradient(data.confidence);
    }, 200);
    
    // Update risk level
    riskValue.textContent = data.riskLevel;
    riskValue.style.color = getRiskColor(data.riskLevel);
    
    // Update risk meter
    riskMeter.className = 'risk-meter';
    riskMeter.classList.add(data.riskLevel.toLowerCase());
    riskMeter.innerHTML = '<div class="risk-dot"></div>'.repeat(3);
    
    // Update explanation
    explanationText.textContent = data.explanation;
    
    // Update key factors
    keyFactors.innerHTML = '';
    if (data.keyFactors && data.keyFactors.length > 0) {
        data.keyFactors.forEach(factor => {
            const tag = document.createElement('div');
            tag.className = 'key-factor-tag';
            tag.textContent = factor;
            keyFactors.appendChild(tag);
        });
    }
    
    // Draw mini chart
    setTimeout(() => {
        drawMiniChart(data.signal);
    }, 300);
    
    // Show result card with animation
    resultCard.classList.remove('hidden');
    
    // Re-enable button
    analyzeBtn.disabled = false;
    analyzeBtn.style.opacity = '1';
    
    // Smooth scroll to results
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    console.log('✅ Real AI Analysis Complete:', data);
}

// Fetch latest news from backend
async function fetchLatestNews() {
    try {
        fetchNewsBtn.disabled = true;
        fetchNewsBtn.innerHTML = '<span class="btn-icon-sm">⏳</span><span>Fetching...</span>';
        
        const response = await fetch(`${BACKEND_URL}/news/latest`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to fetch news');
        }
        
        displayNewsList(data.articles);
        
    } catch (error) {
        console.error('Error fetching news:', error);
        newsList.innerHTML = `
            <div style="padding: 1rem; background: rgba(255, 71, 87, 0.1); border: 1px solid rgba(255, 71, 87, 0.3); border-radius: 12px; color: #ff4757; font-size: 0.85rem;">
                ⚠️ Failed to fetch news. Please check your API keys in backend/application.properties
            </div>
        `;
        newsList.classList.remove('hidden');
    } finally {
        fetchNewsBtn.disabled = false;
        fetchNewsBtn.innerHTML = '<span class="btn-icon-sm">📡</span><span>Fetch Live News</span>';
    }
}

// Display news list
function displayNewsList(articles) {
    if (!articles || articles.length === 0) {
        newsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1rem;">No articles available</p>';
        newsList.classList.remove('hidden');
        return;
    }
    
    newsList.innerHTML = '';
    
    articles.forEach((article, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.style.animationDelay = `${index * 0.1}s`;
        
        const publishedDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent';
        
        newsItem.innerHTML = `
            <div class="news-item-title">${article.title}</div>
            <div class="news-item-meta">
                <span class="news-item-source">${article.source || 'Unknown'}</span>
                <span>•</span>
                <span>${publishedDate}</span>
            </div>
        `;
        
        // Click to analyze
        newsItem.addEventListener('click', () => {
            newsInput.value = article.title;
            charCount.textContent = `${article.title.length}/500`;
            analyzeBtn.disabled = false;
            analyzeWithBackend(article.title);
        });
        
        newsList.appendChild(newsItem);
    });
    
    newsList.classList.remove('hidden');
}

// Show loading
function showLoading() {
    loadingOverlay.classList.remove('hidden');
    resultCard.classList.add('hidden');
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '0.5';
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        loaderProgressBar.style.width = `${progress}%`;
    }, 100);
    
    // Store interval ID for cleanup
    window.loadingInterval = progressInterval;
}

// Hide loading
function hideLoading() {
    if (window.loadingInterval) {
        clearInterval(window.loadingInterval);
    }
    loaderProgressBar.style.width = '100%';
    
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        loaderProgressBar.style.width = '0%';
    }, 200);
}

// Show error message
function showError(message) {
    resultCard.classList.add('hidden');
    
    // Create error toast
    const errorToast = document.createElement('div');
    errorToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: rgba(255, 71, 87, 0.95);
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(255, 71, 87, 0.4);
        z-index: 10000;
        animation: slideInRight 0.4s ease-out;
        max-width: 400px;
        font-size: 0.9rem;
    `;
    errorToast.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.3rem;">⚠️ Error</div>
        <div style="font-size: 0.85rem; opacity: 0.9;">${message}</div>
    `;
    
    document.body.appendChild(errorToast);
    
    setTimeout(() => {
        errorToast.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => errorToast.remove(), 400);
    }, 5000);
}

// Fetch news button handler
fetchNewsBtn.addEventListener('click', fetchLatestNews);

// Add error toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!analyzeBtn.disabled && newsInput.value.trim()) {
            analyzeBtn.click();
        }
    }
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Pause particle animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animateParticles();
    }
});

// ==========================================
// CONSOLE WELCOME MESSAGE
// ==========================================

console.log('%c🚀 AI Trading Signal Engine - PREMIUM', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cBuilt for Kalpathon Hackathon 2026', 'font-size: 14px; color: #00d4ff;');
console.log('%c⚡ Press Ctrl+Enter to quickly analyze', 'font-size: 12px; color: #ffa502;');
console.log('%c✨ Features: Mini Charts, Company Detection, Risk Meter, Key Factors', 'font-size: 11px; color: #a855f7;');
