// AI Chatbot Widget - Dynamic Injection
(function() {
    // Wait for DOM to be ready
    function injectChatbot() {
        // Create chatbot widget container
        const widget = document.createElement('div');
        widget.className = 'chatbot-widget';
        widget.id = 'chatbotWidget';
        
        widget.innerHTML = `
            <button class="chat-toggle-btn" id="chatToggleBtn" onclick="toggleChatbot()">
                <span class="chat-icon">\ud83d\udcac</span>
                <span class="chat-icon-active" style="display: none;">\u2715</span>
                <span class="chat-pulse"></span>
            </button>
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">\ud83e\udd16</div>
                        <div>
                            <h4 class="chat-title">AI Assistant</h4>
                            <p class="chat-status">
                                <span class="status-dot"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button class="chat-close-btn" onclick="toggleChatbot()">\u2715</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot-message">
                        <div class="message-avatar">\ud83e\udd16</div>
                        <div class="message-content">
                            <div class="message-bubble">
                                Hi! \ud83d\udc4b I'm your AI trading assistant. How can I help you today?
                            </div>
                            <span class="message-time">Just now</span>
                        </div>
                    </div>
                </div>
                <div class="typing-indicator" id="typingIndicator" style="display: none;">
                    <div class="message bot-message">
                        <div class="message-avatar">\ud83e\udd16</div>
                        <div class="message-content">
                            <div class="message-bubble typing-bubble">
                                <span class="typing-dot"></span>
                                <span class="typing-dot"></span>
                                <span class="typing-dot"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." onkeypress="handleChatKeyPress(event)" />
                    <button class="chat-send-btn" onclick="sendMessage()" id="chatSendBtn">
                        <span>\u27a4</span>
                    </button>
                </div>
                <div class="chat-quick-actions">
                    <button class="quick-action-btn" onclick="sendQuickMessage('Explain trading signals')">\ud83d\udcca Trading Signals</button>
                    <button class="quick-action-btn" onclick="sendQuickMessage('How to analyze news?')">\ud83d\udcf0 News Analysis</button>
                    <button class="quick-action-btn" onclick="sendQuickMessage('Trading tips')">\ud83d\udca1 Tips</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
    }
    
    // Inject when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbot);
    } else {
        injectChatbot();
    }
})();

// Chatbot Configuration
const CHATBOT_CONFIG = {
    // OpenAI API (requires credits)
    apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Replace with your actual OpenAI API key
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    
    // Set to false to use demo mode (no API calls)
    useRealAPI: false,
    
    systemPrompt: `You are an advanced AI Chatbot integrated into a smart trading application called "Grow My Trade" - an AI News-Based Trading Suggestion Platform.

Your purpose:
- Understand user queries deeply
- Give clear, accurate, and helpful responses
- Assist like a smart human, not a robotic bot

Behavior rules:
- Be conversational and friendly
- Keep answers simple and easy to understand
- Avoid unnecessary long responses
- If the user is confused, guide step-by-step
- If you don't know something, say "I'm not fully sure" instead of guessing

Capabilities:
- Answer general questions about trading and finance
- Explain technical concepts in simple terms
- Help with understanding trading signals (BUY/SELL/HOLD)
- Explain how AI news analysis works
- Give trading tips and suggestions
- Summarize complex topics into short points
- Act like a trading mentor

Trading Platform Context:
- The platform analyzes financial news using AI
- Generates trading signals: BUY, SELL, or HOLD
- Provides confidence scores and risk assessments
- Real-time market data integration
- News-based sentiment analysis

Smart features:
- If user asks something complex → break it into steps
- If user asks "explain like beginner" → simplify deeply
- If user gives a problem → suggest solution + improvements
- If user is learning trading → act like a mentor

Tone:
- Friendly like a senior guide
- Slightly informal but respectful
- Motivating but not overhyped

Output format:
- Use bullet points when needed
- Keep structure clean and readable
- Use emojis occasionally to make it friendly`,
    
    // OpenAI-specific formatting
    formatMessages: function(messages) {
        return {
            model: this.model,
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
        };
    }
};

// Chat state
let chatHistory = [];
let isChatOpen = false;

// Toggle chatbot window
function toggleChatbot() {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatIcon = chatToggleBtn.querySelector('.chat-icon');
    const chatIconActive = chatToggleBtn.querySelector('.chat-icon-active');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatWindow.classList.add('open');
        chatIcon.style.display = 'none';
        chatIconActive.style.display = 'inline';
        document.getElementById('chatInput').focus();
    } else {
        chatWindow.classList.remove('open');
        chatIcon.style.display = 'inline';
        chatIconActive.style.display = 'none';
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to OpenAI API
    try {
        const response = await callOpenAI(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        hideTypingIndicator();
        addMessage("I'm having trouble connecting right now. Please try again in a moment!", 'bot');
        console.error('Chatbot error:', error);
    }
}

// Call OpenAI API
async function callOpenAI(userMessage) {
    // Add to chat history
    chatHistory.push({ role: 'user', content: userMessage });
    
    // Keep only last 10 messages for context
    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(-10);
    }
    
    // If real API is disabled, use demo responses directly
    if (!CHATBOT_CONFIG.useRealAPI) {
        console.log('🎭 Using demo mode (API disabled)');
        chatHistory.push({ role: 'assistant', content: getDemoResponse(userMessage) });
        return getDemoResponse(userMessage);
    }
    
    const messages = [
        { role: 'system', content: CHATBOT_CONFIG.systemPrompt },
        ...chatHistory
    ];
    
    try {
        // Format for OpenAI API
        const openaiPayload = CHATBOT_CONFIG.formatMessages(messages);
        
        console.log('📤 Sending to OpenAI API:', userMessage);
        console.log('🔑 API Key (first 15 chars):', CHATBOT_CONFIG.apiKey.substring(0, 15) + '...');
        
        const response = await fetch(CHATBOT_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATBOT_CONFIG.apiKey}`
            },
            body: JSON.stringify(openaiPayload)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ OpenAI API Error:', errorData);
            
            // Check for quota error
            if (errorData.error?.code === 'insufficient_quota') {
                console.warn('⚠️ API quota exceeded. Switching to demo mode.');
                CHATBOT_CONFIG.useRealAPI = false;
            }
            
            throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('✅ OpenAI Response received');
        
        // Extract response from OpenAI format
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const botResponse = data.choices[0].message.content;
            
            // Add to chat history
            chatHistory.push({ role: 'assistant', content: botResponse });
            
            return botResponse;
        } else {
            console.error('❌ Invalid response structure:', data);
            throw new Error('Invalid response format from OpenAI API');
        }
    } catch (error) {
        console.error('❌ Chatbot API Error:', error);
        console.error('📋 Full error:', error.message);
        console.error('🔧 Check: 1) API key validity 2) Network connection 3) CORS policy 4) API quota');
        
        // Fallback to demo responses if API fails
        return getDemoResponse(userMessage);
    }
}

// Demo response fallback (used when API quota exceeded or disabled)
function getDemoResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('trading signal') || msg.includes('buy') || msg.includes('sell') || msg.includes('hold')) {
        return `📊 **Trading Signals Explained:**

Our AI analyzes financial news and generates three types of signals:

• **BUY** 🟢 - Positive sentiment detected, potential upward movement
  → Confidence: 70-90%
  → Risk: Low to Medium
  
• **SELL** 🔴 - Negative sentiment detected, potential downward movement
  → Confidence: 65-85%
  → Risk: Medium to High
  
• **HOLD** 🟡 - Neutral sentiment, wait for clearer signals
  → Confidence: 50-70%
  → Risk: Medium

**How it works:**
1. AI reads financial headlines
2. Analyzes sentiment (positive/negative)
3. Calculates confidence score
4. Recommends action with risk level

Try analyzing a news article on the News page to see live signals! 💡`;
    }
    
    if (msg.includes('news') || msg.includes('analyze') || msg.includes('how to')) {
        return `📰 **How News Analysis Works:**

**Step-by-Step Process:**

1️⃣ **Fetch News** - We pull real-time financial headlines from NewsAPI
2️⃣ **AI Processing** - Our Gemma SLM analyzes each headline
3️⃣ **Sentiment Detection** - Determines if news is positive/negative
4️⃣ **Signal Generation** - Creates BUY/SELL/HOLD recommendation
5️⃣ **Confidence Scoring** - Rates certainty (0-100%)

**To Use:**
1. Go to **News page**
2. Click **"Analyze with AI ⚡"** on any headline
3. View results on **Dashboard**
4. See signal, confidence, and risk level

The AI looks for keywords like "profit", "loss", "growth", "decline", etc. 🎯`;
    }
    
    if (msg.includes('tip') || msg.includes('advice') || msg.includes('strategy') || msg.includes('recommend')) {
        return `💡 **Trading Tips & Strategies:**

**Essential Tips:**

1. **Always check sentiment** 📊
   - News drives market movements
   - Positive news → potential BUY
   - Negative news → potential SELL

2. **Look at confidence scores** 🎯
   - 80%+ = Strong signal
   - 60-80% = Moderate signal
   - Below 60% = Wait for more data

3. **Diversify your analysis** 🔍
   - Don't rely on single news
   - Check multiple sources
   - Look for patterns

4. **Monitor risk levels** ⚠️
   - High risk = be cautious
   - Medium risk = standard position
   - Low risk = good entry point

5. **Use HOLD signals** ⏸️
   - Sometimes waiting is best
   - Avoid forcing trades
   - Patience pays off

**Remember:** AI assists decisions, but always do your own research! 📈`;
    }
    
    if (msg.includes('help') || msg.includes('how') || msg.includes('what') || msg.includes('feature')) {
        return `🤖 **I Can Help You With:**

**Platform Features:**

📊 **Trading Signals**
   - BUY/SELL/HOLD recommendations
   - Confidence scores (0-100%)
   - Risk level assessments

📰 **News Analysis**
   - Real-time financial headlines
   - AI-powered sentiment analysis
   - Instant signal generation

📈 **Market Data**
   - Live stock prices (Finnhub API)
   - Interactive TradingView-style charts
   - 11 popular stocks available

💡 **How to Use:**
1. Browse **News** → Click "Analyze"
2. View **Dashboard** → See AI signals
3. Check **Market** → View stock charts
4. Ask me anything! 😊

What would you like to know more about?`;
    }
    
    if (msg.includes('gemma') || msg.includes('model') || msg.includes('ai') || msg.includes('technology')) {
        return `🧠 **About Our AI Technology:**

**Model: Gemma 3 1B (Google)**

• **Type:** Small Language Model (SLM)
• **Size:** 1 billion parameters
• **Optimization:** bfloat16 for fast CPU inference
• **Purpose:** Financial sentiment analysis

**How We Use It:**

1. **Input:** Financial news headlines
2. **Processing:** AI analyzes context & sentiment
3. **Output:** Trading signal + confidence score

**Why Gemma?**
✅ Fast inference on CPU
✅ Hackathon compliant
✅ No expensive GPU needed
✅ Open-source and efficient

**Backend:** Flask API on port 5000
**Model Loading:** ~30 seconds on startup
**Response Time:** ~2-5 seconds per analysis

Built for real-time trading decisions! 🚀`;
    }
    
    if (msg.includes('market') || msg.includes('stock') || msg.includes('chart') || msg.includes('price')) {
        return `📈 **Market Data Features:**

**Available Stocks:**
• AAPL (Apple) - ~$178
• TSLA (Tesla) - ~$245
• MSFT (Microsoft) - ~$415
• GOOGL (Google) - ~$152
• AMZN (Amazon) - ~$182
• NVDA (NVIDIA) - ~$875
• META (Meta) - ~$485
• And 4 more!

**Chart Features:**
✅ Real-time price updates
✅ Smooth bezier curves
✅ Dynamic color changes (green/red)
✅ Live pulsing dot
✅ Gradient fill
✅ Grid lines
✅ 3-second update intervals

**To View:**
1. Go to **Market page**
2. Click any stock card
3. See live TradingView-style chart
4. Click "Analyze" to get AI signal

All data from Finnhub API! 📊`;
    }
    
    // Default response for general questions
    return `Thanks for your question! 

I'm currently running in **demo mode** (AI API quota exceeded). Here's what I can tell you:

**About Grow My Trade:**
📊 AI News-Based Trading Suggestion Platform
🤖 Uses Gemma 3 1B model for sentiment analysis
📰 Analyzes financial news in real-time
💡 Generates BUY/SELL/HOLD signals

**Quick Questions I Can Answer:**
• "How to analyze news?"
• "Explain trading signals"
• "Trading tips"
• "What is BUY signal?"
• "How does AI work?"
• "Market data features"

For full AI responses, add credits to your OpenAI account at:
https://platform.openai.com/settings/organization/billing

Is there anything specific you'd like to know? 😊`;
}

// Add message to chat
function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble user-bubble">${content}</div>
                <span class="message-time">${currentTime}</span>
            </div>
            <div class="message-avatar">👤</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-bubble">${formatMessage(content)}</div>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Format message (handle markdown-like formatting)
function formatMessage(content) {
    // Convert line breaks to HTML
    content = content.replace(/\n/g, '<br>');
    
    // Convert bullet points
    content = content.replace(/• /g, '&bull; ');
    
    // Convert bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return content;
}

// Show typing indicator
function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'block';
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// Scroll to bottom of chat
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle Enter key
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send quick message
function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

// Auto-open chat on first visit (optional)
// Uncomment below to auto-open after 3 seconds
// setTimeout(() => {
//     if (!isChatOpen) toggleChatbot();
// }, 3000);
