// Finnhub API Configuration
const FINNHUB_API_KEY = 'd7b7809r01ql9e4linj0';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

let currentStockData = null;
let chartUpdateInterval = null;

// Stock name mapping
const STOCK_NAMES = {
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
    'NFLX': 'Netflix Inc.',
    'AMD': 'Advanced Micro Devices',
    'INTC': 'Intel Corporation',
    'UBER': 'Uber Technologies'
};

// Demo fallback data if API fails
const DEMO_STOCK_DATA = {
    'AAPL': { c: 178.52, pc: 175.20, h: 179.30, l: 176.80 },
    'TSLA': { c: 245.68, pc: 250.40, h: 252.10, l: 243.50 },
    'MSFT': { c: 415.30, pc: 412.80, h: 417.20, l: 413.50 },
    'GOOGL': { c: 152.45, pc: 150.80, h: 153.20, l: 151.30 },
    'AMZN': { c: 182.35, pc: 180.50, h: 183.70, l: 181.20 },
    'NVDA': { c: 875.40, pc: 860.20, h: 880.50, l: 865.30 },
    'META': { c: 485.20, pc: 480.50, h: 488.30, l: 482.10 },
    'NFLX': { c: 598.30, pc: 602.80, h: 605.40, l: 595.20 },
    'AMD': { c: 178.90, pc: 175.60, h: 180.20, l: 176.80 },
    'INTC': { c: 42.85, pc: 43.50, h: 43.80, l: 42.50 },
    'UBER': { c: 72.45, pc: 70.80, h: 73.20, l: 71.30 }
};

// Load stock data from Finnhub API
async function loadStockData() {
    const stockInput = document.getElementById('stockInput');
    const symbol = stockInput.value.trim().toUpperCase();
    
    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }
    
    console.log(`📊 Fetching data for: ${symbol}`);
    
    // Show loading
    showLoading();
    
    try {
        // Fetch quote data
        const response = await fetch(
            `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // Check if data is valid
        if (data.c === 0 && data.h === 0 && data.l === 0) {
            // Try demo fallback data
            console.log('⚠️ API returned no data, using demo data');
            if (DEMO_STOCK_DATA[symbol]) {
                useDemoData(symbol, DEMO_STOCK_DATA[symbol]);
                return;
            }
            throw new Error('Invalid symbol or no data available');
        }
        
        // Store current stock data
        currentStockData = {
            symbol: symbol,
            name: STOCK_NAMES[symbol] || `${symbol} Corporation`,
            currentPrice: data.c,
            previousClose: data.pc,
            high: data.h,
            low: data.l,
            change: data.c - data.pc,
            changePercent: ((data.c - data.pc) / data.pc * 100)
        };
        
        // Update UI
        displayStockData(currentStockData);
        
        // Generate and display chart
        generateMarketChart(currentStockData);
        
        console.log('✅ Stock data loaded successfully');
        
    } catch (error) {
        console.error('❌ Error fetching stock data:', error);
        
        // Try demo fallback
        if (DEMO_STOCK_DATA[symbol]) {
            console.log('🔄 Using demo data as fallback');
            useDemoData(symbol, DEMO_STOCK_DATA[symbol]);
        } else {
            showError('Unable to fetch market data');
        }
    }
}

// Use demo data as fallback
function useDemoData(symbol, data) {
    currentStockData = {
        symbol: symbol,
        name: STOCK_NAMES[symbol] || `${symbol} Corporation`,
        currentPrice: data.c,
        previousClose: data.pc,
        high: data.h,
        low: data.l,
        change: data.c - data.pc,
        changePercent: ((data.c - data.pc) / data.pc * 100)
    };
    
    // Update UI
    displayStockData(currentStockData);
    
    // Generate and display chart
    generateMarketChart(currentStockData);
    
    console.log('✅ Demo data loaded successfully');
}

// Display stock data in UI
function displayStockData(data) {
    // Store for live chart updates
    window.currentStockData = data;
    
    // Hide loading and error states
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    
    // Show stock data card
    document.getElementById('stockDataCard').style.display = 'block';
    
    // Update stock info
    document.getElementById('stockSymbol').textContent = data.symbol;
    document.getElementById('stockName').textContent = data.name;
    document.getElementById('stockPrice').textContent = `$${data.currentPrice.toFixed(2)}`;
    
    // Update change values
    const changeValue = document.getElementById('changeValue');
    const changePercent = document.getElementById('changePercent');
    const changeSign = data.change >= 0 ? '+' : '';
    
    changeValue.textContent = `${changeSign}${data.change.toFixed(2)}`;
    changePercent.textContent = `(${changeSign}${data.changePercent.toFixed(2)}%)`;
    
    // Apply color based on positive/negative
    const isPositive = data.change >= 0;
    const color = isPositive ? '#00ff88' : '#ff4757';
    const glowColor = isPositive ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 71, 87, 0.5)';
    
    changeValue.style.color = color;
    changePercent.style.color = color;
    changeValue.style.textShadow = `0 0 10px ${glowColor}`;
    changePercent.style.background = isPositive ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 71, 87, 0.15)';
    changePercent.style.border = `1px solid ${isPositive ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`;
}

// Generate market chart with realistic data
function generateMarketChart(data) {
    const marketLine = document.getElementById('marketLine');
    const marketArea = document.getElementById('marketArea');
    const marketDot = document.getElementById('marketDot');
    
    if (!marketLine) return;
    
    const width = 500;
    const height = 250;
    const padding = 30;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Generate 40 data points with realistic movement
    const dataPoints = [];
    const isPositive = data.changePercent >= 0;
    const trend = isPositive ? 1 : -1;
    
    // Start from previous close and move toward current price
    let currentPrice = data.previousClose;
    const targetPrice = data.currentPrice;
    const steps = 40;
    
    for (let i = 0; i < steps; i++) {
        const progress = i / (steps - 1);
        // Smooth interpolation with realistic volatility
        const basePrice = data.previousClose + (targetPrice - data.previousClose) * Math.pow(progress, 0.8);
        // Add natural market noise (smaller at start, larger in middle)
        const volatility = (Math.random() - 0.5) * (data.high - data.low) * 0.4 * (0.5 + progress * 0.5);
        dataPoints.push(basePrice + volatility);
    }
    
    // Ensure last point is exactly current price
    dataPoints[dataPoints.length - 1] = data.currentPrice;
    
    // Calculate min/max for scaling with padding
    const minPrice = Math.min(...dataPoints) * 0.999;
    const maxPrice = Math.max(...dataPoints) * 1.001;
    const priceRange = maxPrice - minPrice;
    
    // Generate SVG path with smooth bezier curves
    const points = dataPoints.map((price, index) => {
        const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
        const y = height - padding - ((price - minPrice) / priceRange) * chartHeight;
        return { x, y, price };
    });
    
    // Create smooth cubic bezier curve
    let linePath = `M ${points[0].x} ${points[0].y}`;
    let areaPath = `M ${points[0].x} ${height - padding} L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) / 3;
        const cpx2 = curr.x - (curr.x - prev.x) / 3;
        linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
        areaPath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    areaPath += ` L ${points[points.length - 1].x} ${height - padding} Z`;
    
    // Apply paths with animation
    marketLine.setAttribute('d', linePath);
    marketArea.setAttribute('d', areaPath);
    
    // Set dot position to last point
    const lastPoint = points[points.length - 1];
    marketDot.setAttribute('cx', lastPoint.x);
    marketDot.setAttribute('cy', lastPoint.y);
    
    // Apply colors based on positive/negative
    const lineColor = isPositive ? '#00ff88' : '#ff4757';
    const gradientId = isPositive ? 'marketGradientGreen' : 'marketGradientRed';
    
    marketLine.style.stroke = lineColor;
    marketLine.style.strokeWidth = '3.5';
    marketLine.style.filter = `drop-shadow(0 0 8px ${lineColor}80)`;
    marketDot.style.fill = lineColor;
    marketDot.style.filter = `drop-shadow(0 0 10px ${lineColor})`;
    
    // Update gradient
    updateChartGradient(isPositive);
    
    // Add animation classes
    marketLine.classList.add('chart-line-animated');
    marketArea.classList.add('chart-area-animated');
    marketDot.classList.add('chart-dot-animated');
    
    // Store chart data for live updates
    window.currentChartData = {
        points: points,
        dataPoints: dataPoints,
        minPrice: minPrice,
        maxPrice: maxPrice,
        isPositive: isPositive
    };
    
    // Start live updates
    startLiveChartUpdates();
    
    console.log('✅ Professional chart generated with live updates');
}

// Update chart gradient based on positive/negative
function updateChartGradient(isPositive) {
    const defs = document.querySelector('#marketChart defs');
    if (!defs) return;
    
    // Remove old gradients
    const oldGreen = document.getElementById('marketGradientGreen');
    const oldRed = document.getElementById('marketGradientRed');
    if (oldGreen) oldGreen.remove();
    if (oldRed) oldRed.remove();
    
    // Create new gradient
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    const gradientId = isPositive ? 'marketGradientGreen' : 'marketGradientRed';
    gradient.id = gradientId;
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    
    const color = isPositive ? '#00ff88' : '#ff4757';
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.style.stopColor = color;
    stop1.style.stopOpacity = '0.4';
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.style.stopColor = color;
    stop2.style.stopOpacity = '0.15';
    
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.style.stopColor = color;
    stop3.style.stopOpacity = '0';
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    
    // Update area path to use new gradient
    const marketArea = document.getElementById('marketArea');
    if (marketArea) {
        marketArea.setAttribute('fill', `url(#${gradientId})`);
    }
}

// Live chart updates for continuous movement
let liveChartInterval = null;

function startLiveChartUpdates() {
    // Clear existing interval
    if (liveChartInterval) {
        clearInterval(liveChartInterval);
    }
    
    const marketLine = document.getElementById('marketLine');
    const marketArea = document.getElementById('marketArea');
    const marketDot = document.getElementById('marketDot');
    
    if (!window.currentChartData) return;
    
    let updateCount = 0;
    
    // Update every 3 seconds for smooth live feel
    liveChartInterval = setInterval(() => {
        if (!window.currentChartData) return;
        
        const { points, dataPoints, minPrice, maxPrice, isPositive } = window.currentChartData;
        
        // Remove first point, add new one
        dataPoints.shift();
        
        // Generate new point with slight random movement
        const lastPrice = dataPoints[dataPoints.length - 1];
        const currentData = window.currentStockData;
        
        if (currentData) {
            const volatility = (currentData.high - currentData.low) * 0.02;
            const change = (Math.random() - 0.5) * volatility;
            const newPrice = lastPrice + change;
            dataPoints.push(newPrice);
        }
        
        // Recalculate scaling
        const newMin = Math.min(...dataPoints) * 0.999;
        const newMax = Math.max(...dataPoints) * 1.001;
        const newRange = newMax - newMin;
        
        // Regenerate points
        const width = 500;
        const height = 250;
        const padding = 30;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        const newPoints = dataPoints.map((price, index) => {
            const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
            const y = height - padding - ((price - newMin) / newRange) * chartHeight;
            return { x, y, price };
        });
        
        // Create smooth path
        let linePath = `M ${newPoints[0].x} ${newPoints[0].y}`;
        let areaPath = `M ${newPoints[0].x} ${height - padding} L ${newPoints[0].x} ${newPoints[0].y}`;
        
        for (let i = 1; i < newPoints.length; i++) {
            const prev = newPoints[i - 1];
            const curr = newPoints[i];
            const cpx1 = prev.x + (curr.x - prev.x) / 3;
            const cpx2 = curr.x - (curr.x - prev.x) / 3;
            linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
            areaPath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
        }
        
        areaPath += ` L ${newPoints[newPoints.length - 1].x} ${height - padding} Z`;
        
        // Update SVG with smooth transition
        marketLine.style.transition = 'd 1s ease-in-out';
        marketArea.style.transition = 'd 1s ease-in-out';
        marketDot.style.transition = 'cx 1s ease-in-out, cy 1s ease-in-out';
        
        marketLine.setAttribute('d', linePath);
        marketArea.setAttribute('d', areaPath);
        
        const lastPoint = newPoints[newPoints.length - 1];
        marketDot.setAttribute('cx', lastPoint.x);
        marketDot.setAttribute('cy', lastPoint.y);
        
        // Update stored data
        window.currentChartData = {
            points: newPoints,
            dataPoints: dataPoints,
            minPrice: newMin,
            maxPrice: newMax,
            isPositive: isPositive
        };
        
        updateCount++;
        
        // Regenerate gradient every 10 updates to keep it fresh
        if (updateCount % 10 === 0) {
            updateChartGradient(isPositive);
        }
        
    }, 3000);
    
    console.log('✅ Live chart updates started (3s interval)');
}

// Analyze stock with AI
function analyzeWithAI() {
    if (!currentStockData) {
        alert('Please load stock data first');
        return;
    }
    
    console.log('🤖 Analyzing stock with AI:', currentStockData.symbol);
    
    // Store stock data in localStorage
    localStorage.setItem('selectedStock', JSON.stringify(currentStockData));
    localStorage.setItem('analysisTimestamp', new Date().toISOString());
    
    // Show loading feedback
    const btn = event.target.closest('.btn-analyze');
    if (btn) {
        btn.innerHTML = '<div class="spinner-small"></div> Analyzing...';
        btn.disabled = true;
    }
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('stockDataCard').style.display = 'none';
}

// Show error state
function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('stockDataCard').style.display = 'none';
    console.error('❌', message);
}

// Initialize market page
document.addEventListener('DOMContentLoaded', function() {
    console.log('📈 Market page initialized');
    
    // Load popular stocks grid
    renderPopularStocks();
    
    // Enter key support
    document.getElementById('stockInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadStockData();
        }
    });
});

// Render popular stocks grid
function renderPopularStocks() {
    const grid = document.getElementById('stocksGrid');
    if (!grid) return;
    
    let html = '';
    
    Object.keys(DEMO_STOCK_DATA).forEach((symbol, index) => {
        const data = DEMO_STOCK_DATA[symbol];
        const change = data.c - data.pc;
        const changePercent = (change / data.pc * 100);
        const isPositive = change >= 0;
        const sign = isPositive ? '+' : '';
        
        html += `
            <div class="stock-card-item" onclick="quickLoadStock('${symbol}')" style="animation-delay: ${index * 0.05}s">
                <div class="stock-card-header">
                    <div class="stock-card-symbol">${symbol}</div>
                    <div class="stock-card-badge ${isPositive ? 'positive' : 'negative'}">
                        ${sign}${changePercent.toFixed(2)}%
                    </div>
                </div>
                <div class="stock-card-name">${STOCK_NAMES[symbol]}</div>
                <div class="stock-card-price">$${data.c.toFixed(2)}</div>
                <div class="stock-card-change ${isPositive ? 'positive' : 'negative'}">
                    ${sign}${change.toFixed(2)}
                </div>
                <div class="stock-card-arrow ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '↗' : '↘'}
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    console.log(`✅ Rendered ${Object.keys(DEMO_STOCK_DATA).length} popular stocks`);
}

// Quick load stock from grid
function quickLoadStock(symbol) {
    console.log(`🔍 Quick loading: ${symbol}`);
    
    // Update input
    document.getElementById('stockInput').value = symbol;
    
    // Load data
    loadStockData();
    
    // Scroll to chart
    setTimeout(() => {
        document.getElementById('stockDataCard').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}
