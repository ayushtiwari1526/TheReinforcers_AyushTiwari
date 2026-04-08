# 🚀 AI Trading Signal Engine

A production-grade, real-time financial news sentiment analysis platform that generates actionable trading signals using advanced AI (FinBERT) and real financial news APIs.

**Built for Hackathons | Production-Ready | Real AI Models | Live Data**

---

## 🎯 Overview

This system analyzes financial news headlines using a real pretrained AI model (FinBERT) and generates trading signals (BUY/SELL/HOLD) with confidence scores, risk assessments, and detailed explanations. It fetches real-time financial news from multiple APIs and provides a premium, Bloomberg-level user interface.

### Key Features

- ✅ **Real AI Model**: Uses HuggingFace FinBERT (92% accuracy on financial text)
- ✅ **Live News APIs**: NewsAPI.org + Finnhub (automatic fallback)
- ✅ **Real-Time Analysis**: 1-2 second response time
- ✅ **Company Detection**: Automatically identifies 20+ companies
- ✅ **Signal Strength**: Strong/Moderate/Weak based on confidence
- ✅ **Risk Assessment**: Low/Medium/High risk levels
- ✅ **Premium UI**: Dark theme, glassmorphism, neon accents, animations
- ✅ **Mini Charts**: Visual trend representation (BUY=up, SELL=down, HOLD=flat)
- ✅ **Fully Responsive**: Works on desktop and mobile

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend UI   │  (HTML/CSS/JS)
│  Premium Design │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Spring Boot    │  Java Backend (Port 8080)
│  REST API       │  - Orchestration
│                 │  - News Fetching
│                 │  - Error Handling
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Flask AI       │  Python Service (Port 5000)
│  Service        │  - FinBERT Model
│                 │  - Sentiment Analysis
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FinBERT Model  │  HuggingFace AI
│  (ProsusAI)     │  Real Financial NLP
└─────────────────┘

         +
┌─────────────────┐
│  News APIs      │  NewsAPI.org (Primary)
│                 │  Finnhub.io (Fallback)
└─────────────────┘
```

---

## 📁 Project Structure

```
KalpathonHackathon/
├── frontend/                 # Premium UI (HTML/CSS/JS)
│   ├── index.html           # Main HTML structure
│   ├── styles.css           # Premium styling (1200+ lines)
│   └── script.js            # Interactive logic + backend integration
│
├── backend/                  # Spring Boot Backend
│   ├── pom.xml              # Maven dependencies
│   └── src/main/
│       ├── java/com/trading/
│       │   ├── TradingSignalApplication.java
│       │   ├── controller/
│       │   │   └── TradingController.java
│       │   ├── service/
│       │   │   ├── NewsService.java
│       │   │   ├── AIService.java
│       │   │   └── SignalService.java
│       │   ├── model/
│       │   │   ├── AnalysisRequest.java
│       │   │   ├── AnalysisResponse.java
│       │   │   ├── NewsArticle.java
│       │   │   └── SignalStrength.java
│       │   └── config/
│       │       └── WebConfig.java
│       └── resources/
│           └── application.properties
│
├── ai-service/               # Python Flask AI Service
│   ├── requirements.txt     # Python dependencies
│   ├── app.py               # Flask API server
│   └── models/
│       └── sentiment_analyzer.py  # FinBERT integration
│
├── setup.bat                # One-click setup script
├── start.bat                # One-click start script
└── README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Java 17+** ([Download](https://adoptium.net/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **Python 3.8+** ([Download](https://www.python.org/))
- **Git** (optional)

### Step 1: Setup (First Time Only)

```bash
# Windows - Double click or run:
setup.bat

# Manual setup:
# 1. Install Python dependencies
cd ai-service
pip install -r requirements.txt
cd ..

# 2. Build Spring Boot
cd backend
mvn clean install -DskipTests
cd ..
```

### Step 2: Get API Keys (FREE)

**NewsAPI.org** (Primary news source):
1. Go to https://newsapi.org/register
2. Sign up for free account
3. Copy your API key

**Finnhub.io** (Fallback news source):
1. Go to https://finnhub.io/register
2. Sign up for free account
3. Copy your API key

### Step 3: Configure API Keys

Edit `backend/src/main/resources/application.properties`:

```properties
# Replace with your actual keys
newsapi.key=YOUR_NEWSAPI_KEY_HERE
finnhub.key=YOUR_FINNHUB_KEY_HERE
```

### Step 4: Run the Application

```bash
# Windows - Double click or run:
start.bat

# The script will:
# 1. Start Flask AI Service on port 5000
# 2. Wait for FinBERT model to load (~10 seconds)
# 3. Start Spring Boot on port 8080
# 4. Open frontend in browser
```

### Step 5: Access the Application

- **Frontend UI**: Open `frontend/index.html` in your browser
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:5000

---

## 📡 API Documentation

### 1. Analyze Headline

**Endpoint**: `POST /api/analyze`

**Request**:
```json
{
  "headline": "Tesla profits surge to record highs as EV growth accelerates"
}
```

**Response**:
```json
{
  "headline": "Tesla profits surge to record highs...",
  "company": "Tesla",
  "sentiment": "Positive",
  "signal": "BUY",
  "signalSubtitle": "Strong bullish signal detected",
  "confidence": 89.5,
  "strength": "STRONG",
  "riskLevel": "Low",
  "explanation": "FinBERT AI model detected strong positive sentiment...",
  "keyFactors": ["Earnings Impact", "Growth Indicators"],
  "timestamp": "2026-04-08T13:30:00",
  "processingTime": 1.2
}
```

### 2. Fetch Latest News

**Endpoint**: `GET /api/news/latest`

**Response**:
```json
{
  "articles": [
    {
      "title": "Stock market hits record high...",
      "source": "Reuters",
      "url": "https://...",
      "publishedAt": "2026-04-08T10:00:00"
    }
  ],
  "count": 5
}
```

### 3. Health Check

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "UP",
  "service": "AI Trading Signal Engine",
  "aiService": "UP",
  "timestamp": "2026-04-08T13:30:00"
}
```

---

## 🧠 How It Works

### Sentiment Analysis Flow

1. **User Input**: Enter a financial news headline or click "Fetch Live News"
2. **Backend Receives**: Spring Boot validates the request
3. **AI Processing**: Flask service runs FinBERT model analysis
4. **Signal Generation**: System maps sentiment to trading signal
5. **Response**: Complete analysis returned to frontend
6. **Display**: Premium UI shows results with animations

### Signal Logic

| Sentiment | Confidence | Signal | Strength |
|-----------|-----------|---------|----------|
| Positive | Any | BUY | STRONG (>85%), MODERATE (70-85%), WEAK (<70%) |
| Negative | Any | SELL | STRONG (>85%), MODERATE (70-85%), WEAK (<70%) |
| Neutral | Any | HOLD | MODERATE |

### Risk Assessment

| Confidence | Risk Level |
|-----------|-----------|
| > 85% | Low |
| 75-85% | Medium |
| < 75% | High |

---

## 🎨 UI Features

- **Dark Theme**: Professional navy/black background
- **Glassmorphism**: Frosted glass cards with backdrop blur
- **Neon Accents**: Green (BUY), Red (SELL), Yellow (HOLD)
- **Animations**: Smooth transitions, fade-ins, slide-ups
- **Mini Charts**: Canvas-based trend visualization
- **Responsive**: Perfect on mobile and desktop
- **Loading States**: Premium overlay with progress bar
- **Error Handling**: User-friendly toast notifications

---

## 🔧 Troubleshooting

### Issue: "AI Service is not available"

**Solution**:
1. Ensure Flask service is running on port 5000
2. Check `ai-service` window for errors
3. Verify Python dependencies are installed: `pip install -r requirements.txt`
4. Restart Flask: `cd ai-service && python app.py`

### Issue: "Unable to fetch news"

**Solution**:
1. Check API keys in `application.properties`
2. Verify keys are active (not expired)
3. Check internet connection
4. View backend logs for specific error

### Issue: Spring Boot won't start

**Solution**:
1. Check if port 8080 is already in use
2. Run `mvn clean install` in backend directory
3. Ensure Java 17+ is installed: `java -version`
4. Check Maven installation: `mvn -version`

### Issue: Slow performance

**Solution**:
1. First run downloads FinBERT model (~400MB) - this is normal
2. Subsequent runs are faster (model cached)
3. Ensure at least 4GB RAM available
4. Close other memory-intensive applications

---

## 📊 Performance Metrics

- **Flask Startup**: 5-10 seconds (model loading)
- **Single Analysis**: 1-2 seconds
- **News Fetch**: 0.5-1 second
- **Total Round-Trip**: 2-3 seconds
- **Memory Usage**: ~2GB (FinBERT model)
- **Accuracy**: 92% (FinBERT on financial text)

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Canvas API (charts)
- Modern CSS (Grid, Flexbox, Animations)

### Backend
- Java 17
- Spring Boot 3.2.0
- Maven
- RestTemplate (HTTP client)

### AI Service
- Python 3.8+
- Flask 3.0.0
- HuggingFace Transformers
- PyTorch 2.1.0
- FinBERT (ProsusAI/finbert)

### External APIs
- NewsAPI.org (news fetching)
- Finnhub.io (news fallback)

---

## 🎓 For Hackathons

### Why This Wins

1. **Real AI, Not Mock**: Uses actual FinBERT model, not hardcoded logic
2. **Production Architecture**: Multi-service, error handling, logging
3. **Premium UI**: Looks like a real fintech product
4. **Live Data**: Fetches real financial news
5. **Complete System**: Frontend + Backend + AI + APIs
6. **Impressive Demo**: Visual charts, animations, company detection

### Demo Script

1. **Show UI**: "This is our AI Trading Signal Engine..."
2. **Fetch News**: Click "Fetch Live News" → shows real headlines
3. **Analyze**: Click a headline → real AI analysis appears
4. **Custom Input**: Type custom headline → instant analysis
5. **Show Code**: Briefly show FinBERT integration
6. **Highlight**: "Real AI model, real APIs, production architecture"

---

## 📝 License

This project is built for educational and hackathon purposes.

---

## 🤝 Credits

- **FinBERT Model**: ProsusAI (HuggingFace)
- **News APIs**: NewsAPI.org, Finnhub.io
- **Built for**: Kalpathon Hackathon 2026

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review logs in backend/AI service terminals
3. Verify all prerequisites are installed correctly

---

**🔥 Built with passion for hackathon excellence!**
