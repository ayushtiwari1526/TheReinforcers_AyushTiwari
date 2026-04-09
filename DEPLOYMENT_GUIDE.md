# 🚀 Deployment Guide - Grow My Trade

> **Complete step-by-step guide to deploy your AI Trading Signal Platform**

---

## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Option 1: Local Deployment (Best for Demo)](#option-1-local-deployment-best-for-demo)
3. [Option 2: Cloud Deployment (Production)](#option-2-cloud-deployment-production)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Common Issues & Solutions](#common-issues--solutions)

---

## 🎯 Deployment Options

### **Choose Your Deployment Method:**

| Option | Best For | Difficulty | Cost |
|--------|----------|-----------|------|
| **Local Deployment** | Hackathon demo, testing | ⭐ Easy | Free |
| **Render.com** | Free cloud hosting | ⭐⭐ Medium | Free tier |
| **Railway.app** | Easy cloud deployment | ⭐⭐ Medium | $5/month |
| **AWS/GCP** | Production scale | ⭐⭐⭐ Hard | Pay-as-you-go |

---

## 🖥️ Option 1: Local Deployment (Best for Demo)

### **Perfect for:**
- ✅ Hackathon presentations
- ✅ Testing before deployment
- ✅ Development & debugging
- ✅ Offline demos

---

### **Step 1: Prerequisites**

Install these if you don't have them:

```powershell
# Check if installed
java -version
python --version
mvn -version

# Download if needed:
# Java: https://adoptium.net/
# Python: https://www.python.org/
# Maven: https://maven.apache.org/download.cgi
```

---

### **Step 2: Get Required API Keys (FREE)**

#### **A. NewsAPI.org** (For fetching financial news)
1. Go to: https://newsapi.org/register
2. Sign up (free)
3. Copy your API key

#### **B. Finnhub.io** (For stock market data)
1. Go to: https://finnhub.io/register
2. Sign up (free)
3. Copy your API key

#### **C. HuggingFace Token** (For Gemma AI model)
1. Go to: https://huggingface.co/settings/tokens
2. Create new token (free)
3. Copy the token (starts with `hf_`)

#### **D. OpenAI API Key** (For chatbot - optional)
1. Go to: https://platform.openai.com/api-keys
2. Create API key (needs credits, or use demo mode)

---

### **Step 3: Configure API Keys**

Edit this file: `backend/src/main/resources/application.properties`

```properties
# Replace with your actual keys
newsapi.key=YOUR_NEWSAPI_KEY_HERE
finnhub.key=YOUR_FINNHUB_KEY_HERE
```

---

### **Step 4: Set HuggingFace Token**

Open PowerShell and run:

```powershell
# Set HF Token (replace with your actual token)
$env:HF_TOKEN = "hf_your_token_here"

# Navigate to ai-service
cd C:\Users\ACER\OneDrive\Desktop\KalpathonHackathon\ai-service

# Start AI Service
C:\Users\ACER\AppData\Local\Programs\Python\Python310\python.exe app.py
```

**Wait for:** `GEMMA SLM AI SERVICE READY!` message (~30 seconds)

---

### **Step 5: Start All Services**

Open **3 separate PowerShell windows**:

#### **Terminal 1 - AI Service (Python)**
```powershell
$env:HF_TOKEN = "hf_your_token_here"
cd C:\Users\ACER\OneDrive\Desktop\KalpathonHackathon\ai-service
C:\Users\ACER\AppData\Local\Programs\Python\Python310\python.exe app.py
```

#### **Terminal 2 - Backend (Java)**
```powershell
cd C:\Users\ACER\OneDrive\Desktop\KalpathonHackathon\backend
java -jar target/trading-signal-engine-1.0.0.jar
```

#### **Terminal 3 - Frontend (HTTP Server)**
```powershell
cd C:\Users\ACER\OneDrive\Desktop\KalpathonHackathon\frontend
npx http-server -p 3000 --cors
```

---

### **Step 6: Access Your App**

Open browser and go to:

👉 **http://localhost:3000**

**Verify everything is working:**
- ✅ Homepage loads
- ✅ Market page shows charts
- ✅ Chatbot button appears
- ✅ Can navigate between pages

---

### **Step 7: Test Features**

1. **Go to Market page** → Click any stock → See live charts
2. **Go to News page** → Fetch news → Click "Analyze with AI"
3. **Go to Dashboard** → View trading signals
4. **Click chatbot** → Ask "How to analyze news?"

---

## ☁️ Option 2: Cloud Deployment (Production)

### **Recommended: Render.com (Free Tier)**

This will deploy your app to the cloud so anyone can access it!

---

### **Architecture for Cloud:**

```
Frontend:  Netlify/Vercel (Free)
Backend:   Render.com (Free tier available)
AI Service: Render.com (Free tier)
Database:  Not needed (stateless)
```

---

### **Step 1: Prepare Your Repository**

Your code is already on GitHub! ✅

**Repository:** https://github.com/ayushtiwari1526/TheReinforcers_AyushTiwari

**Before deploying, add these to `.env` file (create it in root):**

```env
# .env file (DO NOT commit to Git)
HF_TOKEN=hf_your_huggingface_token
NEWSAPI_KEY=your_newsapi_key
FINNHUB_KEY=your_finnhub_key
OPENAI_API_KEY=your_openai_key (optional)
```

---

### **Step 2: Deploy Frontend to Netlify (FREE)**

#### **A. Sign up for Netlify**
1. Go to: https://www.netlify.com/
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"

#### **B. Configure Deployment**
- **Connect to GitHub**: Select your repository
- **Branch**: `main`
- **Publish directory**: `frontend`
- **Build command**: Leave empty (static site)

#### **C. Deploy**
Click "Deploy site"

**You'll get:** `https://your-site-name.netlify.app`

---

### **Step 3: Deploy Backend to Render (FREE)**

#### **A. Sign up for Render**
1. Go to: https://render.com/
2. Sign up with GitHub

#### **B. Create Web Service**
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `trading-signal-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Java`
   - **Build Command**: `mvn clean install -DskipTests`
   - **Start Command**: `java -jar target/trading-signal-engine-1.0.0.jar`

#### **C. Set Environment Variables**
In Render dashboard, add:
```
NEWSAPI_KEY=your_newsapi_key
FINNHUB_KEY=your_finnhub_key
AI_SERVICE_URL=https://your-ai-service.onrender.com
```

#### **D. Deploy**
Click "Create Web Service"

**You'll get:** `https://trading-signal-backend.onrender.com`

---

### **Step 4: Deploy AI Service to Render (FREE)**

⚠️ **Note**: Free tier has limitations (spins down after inactivity)

#### **A. Create New Web Service**
1. Click "New" → "Web Service"
2. Connect repository
3. Configure:
   - **Name**: `trading-ai-service`
   - **Root Directory**: `ai-service`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

#### **B. Set Environment Variables**
```
HF_TOKEN=hf_your_huggingface_token
PORT=5000
```

#### **C. Deploy**
Click "Create Web Service"

**You'll get:** `https://trading-ai-service.onrender.com`

---

### **Step 5: Update Backend Configuration**

After deploying AI service, update backend's `application.properties`:

```properties
ai.service.url=https://trading-ai-service.onrender.com
```

Commit and push the change.

---

### **Step 6: Update Frontend API URL**

Create a file `frontend/config.js`:

```javascript
const API_CONFIG = {
    BACKEND_URL: 'https://trading-signal-backend.onrender.com',
    AI_SERVICE_URL: 'https://trading-ai-service.onrender.com'
};
```

Update all JavaScript files to use `API_CONFIG.BACKEND_URL` instead of `http://localhost:8080`.

---

### **Step 7: Test Cloud Deployment**

Visit your Netlify URL: `https://your-site-name.netlify.app`

**Test all features:**
- ✅ Pages load
- ✅ News fetching works
- ✅ AI analysis works
- ✅ Market charts load
- ✅ Chatbot works

---

## 🔐 Environment Variables Setup

### **Local Development (PowerShell)**

```powershell
# Set variables for current session
$env:HF_TOKEN = "hf_your_token"
$env:NEWSAPI_KEY = "your_key"
$env:FINNHUB_KEY = "your_key"
$env:OPENAI_API_KEY = "your_key"

# Verify
echo $env:HF_TOKEN
```

### **Production (Render/Netlify)**

Add these in the dashboard under "Environment Variables":

```
HF_TOKEN=hf_your_token_here
NEWSAPI_KEY=your_newsapi_key_here
FINNHUB_KEY=your_finnhub_key_here
OPENAI_API_KEY=sk_your_openai_key_here (optional)
```

---

## ⚠️ Common Issues & Solutions

### **Issue 1: AI Service won't start**

**Error:** `Illegal header value b'Bearer '`

**Solution:**
```powershell
# Check if token is set
echo $env:HF_TOKEN

# If empty, set it:
$env:HF_TOKEN = "hf_your_actual_token"
```

---

### **Issue 2: News not loading**

**Error:** "Unable to fetch news"

**Solution:**
1. Check API key in `application.properties`
2. Verify NewsAPI account is active
3. Free tier: 100 requests/day limit

---

### **Issue 3: CORS errors in browser**

**Error:** `Access-Control-Allow-Origin`

**Solution:**
Backend already has CORS enabled. If issues:
```java
// In backend/src/main/java/com/trading/config/WebConfig.java
// Verify CORS configuration allows your frontend URL
```

---

### **Issue 4: Port already in use**

**Error:** `Port 8080 was already in use`

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID your_pid /F
```

---

### **Issue 5: Chatbot shows demo responses**

**Cause:** OpenAI API quota exceeded

**Solution:**
- **Option 1:** Add credits to OpenAI account
- **Option 2:** Keep using demo mode (works great for demos!)

---

### **Issue 6: Slow AI responses**

**Cause:** Gemma model loading on CPU

**Solution:**
- First run downloads model (~4GB) - takes 1-2 minutes
- Subsequent runs: 2-5 seconds
- Free tier services spin down - first request after idle takes longer

---

## 📊 Deployment Checklist

### **Before Deploying:**

- [ ] All API keys obtained
- [ ] `.gitignore` includes sensitive files
- [ ] API keys NOT committed to Git
- [ ] Code pushed to GitHub
- [ ] README updated with deployment URL

### **After Deploying:**

- [ ] Frontend loads without errors
- [ ] Backend responds to API calls
- [ ] AI service analyzes text
- [ ] News fetching works
- [ ] Market charts display
- [ ] Chatbot responds
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎯 Quick Commands Reference

### **Start Everything Locally:**

```powershell
# Terminal 1 - AI Service
$env:HF_TOKEN = "hf_your_token"
cd ai-service
C:\Users\ACER\AppData\Local\Programs\Python\Python310\python.exe app.py

# Terminal 2 - Backend
cd backend
java -jar target/trading-signal-engine-1.0.0.jar

# Terminal 3 - Frontend
cd frontend
npx http-server -p 3000 --cors
```

### **Check if Services are Running:**

```powershell
# Check ports
netstat -ano | findstr ":3000 :5000 :8080"

# Test endpoints
curl http://localhost:8080/api/health
curl http://localhost:5000/health
```

### **Stop All Services:**

```powershell
# Kill Java and Python processes
taskkill /F /IM java.exe /IM python.exe
```

---

## 💰 Cost Breakdown

### **Free Tier Deployment:**

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Netlify | FREE |
| Backend | Render | FREE |
| AI Service | Render | FREE |
| NewsAPI | NewsAPI.org | FREE (100 req/day) |
| Finnhub | Finnhub.io | FREE (60 req/min) |
| HuggingFace | HuggingFace | FREE |
| **Total** | | **$0/month** 🎉 |

### **Production Deployment:**

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Netlify Pro | $19/month |
| Backend | Render Standard | $7/month |
| AI Service | Render Standard | $7/month |
| **Total** | | **$33/month** |

---

## 🚀 Recommended for Hackathon

**Use Local Deployment!**

**Why:**
- ✅ Completely free
- ✅ Fast responses (no cold starts)
- ✅ No internet dependency
- ✅ Easy to debug
- ✅ Perfect for live demos

**Backup Plan:**
- Deploy to Render/Netlify as backup
- Have video recording ready
- Screenshots of working features

---

## 📞 Need Help?

If you encounter issues:

1. Check browser console (`F12`)
2. Check server terminal logs
3. Verify all API keys are correct
4. Test each service individually
5. Check network connectivity

**Common Debug Commands:**
```powershell
# Test backend
curl http://localhost:8080/api/health

# Test AI service
curl http://localhost:5000/health

# Test frontend
curl http://localhost:3000
```

---

## 🎉 Success!

Once deployed, share your app:

- **Local**: `http://localhost:3000`
- **Cloud**: `https://your-app.netlify.app`

**Happy deploying! 🚀**

---

*Last updated: April 9, 2026*
