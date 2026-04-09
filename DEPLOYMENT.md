# 🚀 Deployment - Quick Start

> **Everything is ready! Just follow these steps.**

---

## ✅ What I've Prepared For You

### **Configuration Files Created:**

1. ✅ **`render.yaml`** - Render auto-deployment config
2. ✅ **`vercel.json`** - Vercel deployment config
3. ✅ **`api-config.js`** - Auto-detects environment (local/Render/Vercel)
4. ✅ **`application.properties`** - Uses environment variables
5. ✅ **`.env.example`** - Template for local development
6. ✅ **`.env.local.example`** - Template for Vercel

### **Documentation Created:**

1. ✅ **`RENDER_VERCEL_DEPLOYMENT.md`** - Complete step-by-step guide (696 lines)
2. ✅ **`DEPLOYMENT_CHECKLIST.md`** - Printable checklist
3. ✅ **`DEPLOYMENT.md`** - This quick start guide

---

## 🎯 Deployment Architecture

```
Frontend (Vercel)  →  Backend (Render)  →  AI Service (Render)
     ↓                      ↓                      ↓
  Static CDN          Spring Boot            Flask + Gemma
  Global CDN          REST API              Sentiment Analysis
  FREE                FREE tier             FREE tier
```

---

## 📋 Quick Steps

### **Step 1: Get API Keys (5 minutes)**

| API | URL | Time |
|-----|-----|------|
| **NewsAPI** | https://newsapi.org/register | 2 min |
| **Finnhub** | https://finnhub.io/register | 2 min |
| **HuggingFace** | https://huggingface.co/settings/tokens | 1 min |

---

### **Step 2: Deploy Backend to Render (10 minutes)**

1. Go to: https://render.com
2. Sign up with GitHub
3. New Web Service → Select your repo
4. Config:
   - Root Directory: `backend`
   - Build: `mvn clean install -DskipTests`
   - Start: `java -jar target/trading-signal-engine-1.0.0.jar`
5. Add env vars:
   ```
   NEWSAPI_KEY=f9525722f8744ba0a793aef0acfa84c2
   FINNHUB_KEY=d7b7809r01ql9e4linj0
   AI_SERVICE_URL=http://localhost:5000 (update later)
   JAVA_OPTS=-Xmx512m
   ```
6. Deploy → Copy URL

---

### **Step 3: Deploy AI Service to Render (10 minutes)**

1. New Web Service → Same repo
2. Config:
   - Root Directory: `ai-service`
   - Build: `pip install -r requirements.txt`
   - Start: `python app.py`
3. Add env vars:
   ```
   HF_TOKEN=hf_your_token
   PORT=5000
   ```
4. Deploy → Copy URL

---

### **Step 4: Deploy Frontend to Vercel (5 minutes)**

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import your repo
4. Config:
   - Output Directory: `frontend`
5. Add env vars:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.onrender.com
   PLATFORM=vercel
   ```
6. Deploy → Done! 🎉

---

### **Step 5: Connect Services (2 minutes)**

1. Go to Render → Backend service
2. Update `AI_SERVICE_URL`:
   ```
   AI_SERVICE_URL=https://trading-ai-service.onrender.com
   ```
3. Save → Auto-redeploys

---

## 📚 Full Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **`RENDER_VERCEL_DEPLOYMENT.md`** | Complete guide with troubleshooting | First-time deployment |
| **`DEPLOYMENT_CHECKLIST.md`** | Printable checklist | Track your progress |
| **`DEPLOYMENT.md`** | This quick start | Quick reference |

---

## 🔗 Important URLs

### **After Deployment:**

```
Frontend:  https://grow-my-trade.vercel.app
Backend:   https://trading-signal-backend.onrender.com
AI Service: https://trading-ai-service.onrender.com
```

### **Health Checks:**

```
https://trading-signal-backend.onrender.com/api/health
https://trading-ai-service.onrender.com/health
https://grow-my-trade.vercel.app
```

---

## 💡 Key Features

### **Auto Environment Detection:**

```javascript
// On localhost → uses local URLs
// On Vercel → uses Render URLs
// NO code changes needed!
```

### **Auto Deployment:**

```bash
git push
# That's it! Vercel & Render handle the rest
```

### **Environment Variables:**

- ✅ Backend reads from Render env vars
- ✅ Frontend reads from Vercel env vars
- ✅ Never commit API keys to Git

---

## ⚠️ Important Notes

### **Free Tier Limitations:**

1. **Render Free Tier:**
   - ⏰ Spins down after 15 min inactivity
   - 🐌 First request after idle: 30-60 seconds
   - ✅ Solution: Use UptimeRobot (free)

2. **Vercel Free Tier:**
   - ✅ No spin-down
   - ✅ 100GB bandwidth/month
   - ✅ Perfect for production

---

## 🎯 For Hackathon Demo

**Recommended:**

✅ Deploy to cloud (impressive!)  
✅ Keep local version ready (faster)  
✅ Record backup video  
✅ Practice demo 2-3 times  

---

## 📞 Need Help?

**Common Issues:**

| Problem | Solution |
|---------|----------|
| Render spin-down | Use UptimeRobot |
| CORS errors | Already configured |
| AI service slow | Normal on free tier |
| Can't connect | Check env vars |

**Full Troubleshooting:** See `RENDER_VERCEL_DEPLOYMENT.md`

---

## 🚀 Ready to Deploy?

1. Open: `RENDER_VERCEL_DEPLOYMENT.md`
2. Follow Part 1, 2, 3
3. Use `DEPLOYMENT_CHECKLIST.md` to track progress
4. Ask me if stuck!

---

**Your code is 100% cloud-ready!** ☁️✨

**Total deployment time: ~30 minutes**

**Cost: $0/month (free tier)**
