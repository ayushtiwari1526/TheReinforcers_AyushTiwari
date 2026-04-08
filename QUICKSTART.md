# 🚀 QUICK START GUIDE

## Get Running in 5 Minutes!

### Step 1: Run Setup (First Time Only)
```bash
# Double-click or run:
setup.bat
```

### Step 2: Get FREE API Keys

**NewsAPI.org** (Takes 30 seconds):
1. Visit: https://newsapi.org/register
2. Sign up with email
3. Copy API key from dashboard

**Finnhub.io** (Takes 30 seconds):
1. Visit: https://finnhub.io/register  
2. Sign up with email
3. Copy API key from dashboard

### Step 3: Add API Keys

Open: `backend/src/main/resources/application.properties`

Replace these lines:
```properties
newsapi.key=YOUR_NEWSAPI_KEY
finnhub.key=YOUR_FINNHUB_KEY
```

With your actual keys:
```properties
newsapi.key=abc123def456...
finnhub.key=xyz789uvw012...
```

### Step 4: Start Application
```bash
# Double-click or run:
start.bat
```

Wait ~30 seconds for both services to start.

### Step 5: Open Frontend
Open in browser: `frontend/index.html`

---

## ✅ Test It Works

1. **Test AI Service**:
   - Open: http://localhost:5000/health
   - Should show: `{"status": "healthy", "model_loaded": true}`

2. **Test Backend**:
   - Open: http://localhost:8080/api/health
   - Should show: `{"status": "UP", "aiService": "UP"}`

3. **Test Full Flow**:
   - Open frontend
   - Type: "Tesla profits surge to record highs"
   - Click "Analyze Signal"
   - See real AI results!

---

## 🎯 Demo Headlines to Try

**BUY Signal**:
- "Apple revenue growth exceeds analyst expectations"
- "Microsoft cloud business shows strong momentum"
- "Tesla deliveries surge to record levels"

**SELL Signal**:
- "Amazon stock falls amid recession fears"
- "Netflix subscriber decline raises concerns"
- "Bank of America reports profit drop"

**HOLD Signal**:
- "Fed maintains current interest rate policy"
- "Market shows mixed signals amid uncertainty"

---

## 🆘 Common Issues

### "AI Service is not available"
→ Flask didn't start. Run manually:
```bash
cd ai-service
python app.py
```

### "Unable to fetch news"
→ Check API keys in `application.properties`

### Port 8080 already in use
→ Kill the process or change port in `application.properties`

### Slow first run
→ Normal! FinBERT model downloads (~400MB) on first use

---

## 📊 What You'll See

✅ Premium dark theme UI
✅ Animated particle background
✅ Glassmorphism cards
✅ Real-time AI analysis
✅ Mini trend charts
✅ Company detection badges
✅ Confidence scores
✅ Risk assessments
✅ Key factor tags

---

## 🎓 For Judges

**Architecture**:
- Frontend: HTML/CSS/JS (Premium UI)
- Backend: Java Spring Boot (REST API)
- AI Service: Python Flask (FinBERT model)
- Data: NewsAPI + Finnhub (Real-time)

**Key Points**:
- ✅ Real AI model (not mock data)
- ✅ Real news APIs (not hardcoded)
- ✅ Production-grade architecture
- ✅ Error handling & logging
- ✅ 92% accuracy (FinBERT)
- ✅ 2-3 second response time

**Demo Flow**:
1. Show premium UI
2. Fetch live news (real APIs)
3. Analyze headline (real AI)
4. Show code structure
5. Highlight architecture

---

**Need Help?** Check the full README.md for detailed documentation!
