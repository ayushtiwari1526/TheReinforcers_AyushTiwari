# 🚀 Complete Deployment Guide - Render + Vercel

> **Step-by-step guide to deploy your AI Trading Signal Platform to the cloud**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Part 1: Deploy Backend to Render](#part-1-deploy-backend-to-render)
5. [Part 2: Deploy AI Service to Render](#part-2-deploy-ai-service-to-render)
6. [Part 3: Deploy Frontend to Vercel](#part-3-deploy-frontend-to-vercel)
7. [Part 4: Connect Everything](#part-4-connect-everything)
8. [Part 5: Test & Verify](#part-5-test--verify)
9. [Troubleshooting](#troubleshooting)
10. [Cost Breakdown](#cost-breakdown)

---

## 🎯 Overview

Your app will be deployed to:

- **Frontend** → **Vercel** (FREE, fast CDN)
- **Backend** → **Render** (FREE tier available)
- **AI Service** → **Render** (FREE tier available)

**Total Cost: $0/month** (free tier)

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Vercel (CDN)  │  Frontend (HTML/CSS/JS)
│  growmytrade.   │  Static site, globally distributed
│  vercel.app     │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│   Render        │  Backend (Spring Boot)
│  trading-signal │  REST API, business logic
│  .onrender.com  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Render        │  AI Service (Flask + Gemma)
│  trading-ai     │  Sentiment analysis
│  .onrender.com  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  External APIs  │  NewsAPI + Finnhub + HuggingFace
└─────────────────┘
```

---

## ✅ Prerequisites

### **What You Need:**

1. ✅ **GitHub Account** (you already have)
2. ✅ **Code on GitHub** (already done)
3. ✅ **API Keys** (get these first):
   - [NewsAPI Key](https://newsapi.org/register) - FREE
   - [Finnhub Key](https://finnhub.io/register) - FREE
   - [HuggingFace Token](https://huggingface.co/settings/tokens) - FREE

### **What I've Already Prepared:**

✅ `render.yaml` - Render deployment configuration  
✅ `vercel.json` - Vercel deployment configuration  
✅ `api-config.js` - Auto-detects environment (local/Render/Vercel)  
✅ `application.properties` - Uses environment variables  
✅ All code is cloud-ready!

---

## 🚀 Part 1: Deploy Backend to Render

### **Step 1: Sign Up for Render**

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Click **"Sign up with GitHub"**
4. Authorize Render to access your repositories
5. Select repository: `TheReinforcers_AyushTiwari`

---

### **Step 2: Create Backend Web Service**

1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. Fill in the configuration:

```yaml
Name: trading-signal-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Runtime: Java
Build Command: mvn clean install -DskipTests
Start Command: java -jar target/trading-signal-engine-1.0.0.jar
Plan: Free
```

---

### **Step 3: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `NEWSAPI_KEY` | `f9525722f8744ba0a793aef0acfa84c2` |
| `FINNHUB_KEY` | `d7b7809r01ql9e4linj0` |
| `AI_SERVICE_URL` | `http://localhost:5000` (we'll update this later) |
| `JAVA_OPTS` | `-Xmx512m` |
| `ALLOWED_ORIGINS` | `*` |

---

### **Step 4: Deploy**

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build
3. Render will give you a URL like:
   ```
   https://trading-signal-backend.onrender.com
   ```

**✅ Copy this URL!** You'll need it.

---

### **Step 5: Verify Backend**

Test your deployed backend:

```
https://trading-signal-backend.onrender.com/api/health
```

You should see:
```json
{
  "status": "UP",
  "service": "AI Trading Signal Engine"
}
```

---

## 🚀 Part 2: Deploy AI Service to Render

### **Step 1: Create Another Web Service**

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Select same repository
4. Fill in configuration:

```yaml
Name: trading-ai-service
Region: Oregon (same as backend)
Branch: main
Root Directory: ai-service
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: python app.py
Plan: Free
```

---

### **Step 2: Add Environment Variables**

| Key | Value |
|-----|-------|
| `HF_TOKEN` | `hf_your_huggingface_token_here` |
| `PORT` | `5000` |

---

### **Step 3: Deploy**

1. Click **"Create Web Service"**
2. Wait 5-10 minutes (downloads Gemma model ~4GB)
3. First deployment is slow, subsequent ones are faster
4. You'll get URL like:
   ```
   https://trading-ai-service.onrender.com
   ```

**✅ Copy this URL!**

---

### **Step 4: Verify AI Service**

Test:
```
https://trading-ai-service.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "AI Trading Signal Service"
}
```

---

## 🚀 Part 3: Deploy Frontend to Vercel

### **Step 1: Sign Up for Vercel**

1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel

---

### **Step 2: Import Project**

1. Click **"Add New..."** → **"Project"**
2. Find your repository: `TheReinforcers_AyushTiwari`
3. Click **"Import"**

---

### **Step 3: Configure Build Settings**

Vercel will auto-detect `vercel.json`. Configure:

```yaml
Project Name: grow-my-trade
Framework Preset: Other
Root Directory: ./
Build Command: (leave empty)
Output Directory: frontend
Install Command: (leave empty)
```

---

### **Step 4: Add Environment Variables**

Click **"Environment Variables"** → Add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://trading-signal-backend.onrender.com/api` |
| `NEXT_PUBLIC_AI_SERVICE_URL` | `https://trading-ai-service.onrender.com` |
| `PLATFORM` | `vercel` |

---

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait 1-2 minutes
3. You'll get URL like:
   ```
   https://grow-my-trade.vercel.app
   ```

**🎉 Your app is LIVE!**

---

## 🔗 Part 4: Connect Everything

### **Step 1: Update Backend AI Service URL**

1. Go to Render Dashboard
2. Click `trading-signal-backend`
3. Go to **"Environment"** tab
4. Update `AI_SERVICE_URL`:

```
AI_SERVICE_URL=https://trading-ai-service.onrender.com
```

5. Click **"Save Changes"**
6. Backend will auto-redeploy (~2 minutes)

---

### **Step 2: Update Frontend Config (If Needed)**

The `api-config.js` is already configured with:

```javascript
cloud: {
    BACKEND_URL: 'https://trading-signal-backend.onrender.com/api',
    AI_SERVICE_URL: 'https://trading-ai-service.onrender.com'
}
```

**If your Render URLs are different, update them:**

1. Edit `frontend/api-config.js`
2. Update the cloud URLs
3. Commit and push:

```bash
git add frontend/api-config.js
git commit -m "update cloud deployment URLs"
git push
```

Vercel will automatically redeploy!

---

## ✅ Part 5: Test & Verify

### **Visit Your Live App:**

```
https://grow-my-trade.vercel.app
```

### **Test Checklist:**

- [ ] Homepage loads
- [ ] All pages accessible (Dashboard, News, Market, About, Contact)
- [ ] Market page shows charts
- [ ] News page loads news
- [ ] "Analyze with AI" works
- [ ] Dashboard shows signals
- [ ] Chatbot appears
- [ ] No console errors (F12)

### **API Tests:**

```bash
# Test Backend
curl https://trading-signal-backend.onrender.com/api/health

# Test AI Service
curl https://trading-ai-service.onrender.com/health

# Test News Fetch
curl https://trading-signal-backend.onrender.com/api/news/latest
```

---

## 🔧 Troubleshooting

### **Issue 1: Render Service Spins Down**

**Problem:** Free tier services sleep after 15 min inactivity

**Solutions:**

**Option A: Keep Awake Service (FREE)**
1. Sign up: https://uptimerobot.com
2. Add monitor for your Render URLs
3. Checks every 5 minutes
4. Prevents spin-down

**Option B: Accept Cold Starts**
- First request after idle: 30-60 seconds
- Subsequent requests: Fast
- Fine for demos

---

### **Issue 2: CORS Errors**

**Error:** `Access-Control-Allow-Origin`

**Solution:**
Backend already allows all origins:
```properties
allowed.origins=${ALLOWED_ORIGINS:*}
```

If still getting errors, check browser console for exact error.

---

### **Issue 3: Backend Can't Reach AI Service**

**Error:** `Connection refused` or timeout

**Solution:**
1. Check `AI_SERVICE_URL` in Render environment variables
2. Verify AI service is running:
   ```
   https://trading-ai-service.onrender.com/health
   ```
3. Check Render logs for errors

---

### **Issue 4: Frontend Can't Reach Backend**

**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Open browser console (F12)
2. Check what URL it's trying to reach
3. Verify `api-config.js` has correct URLs
4. Test backend directly in browser

---

### **Issue 5: AI Service Slow or Failing**

**Problem:** Gemma model loading takes time/memory

**Solutions:**

**For Free Tier:**
- First request after spin-down: Slow (1-2 min)
- Subsequent requests: Fast (2-5 sec)
- Use UptimeRobot to keep awake

**For Production:**
- Upgrade to Render Standard ($7/month)
- Always-on, no spin-down
- More memory (512MB → 1GB+)

---

### **Issue 6: Build Fails on Render**

**Java Build Error:**
```
Solution: Check pom.xml exists in backend/
```

**Python Build Error:**
```
Solution: Check requirements.txt exists in ai-service/
```

**View Logs:**
- Go to Render Dashboard
- Click service
- View "Logs" tab

---

## 💰 Cost Breakdown

### **Free Tier (Hackathon/Testing):**

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Vercel** | Hobby | FREE | 100GB bandwidth/month |
| **Render (Backend)** | Free | FREE | 750 hours/month |
| **Render (AI Service)** | Free | FREE | 750 hours/month |
| **NewsAPI** | Developer | FREE | 100 requests/day |
| **Finnhub** | Free | FREE | 60 requests/min |
| **HuggingFace** | Free | FREE | Unlimited |
| **UptimeRobot** | Free | FREE | 50 monitors |
| **TOTAL** | | **$0/month** 🎉 | |

### **Production (If You Scale):**

| Service | Plan | Cost |
|---------|------|------|
| Vercel Pro | $20/month | Advanced features |
| Render Standard (Backend) | $7/month | Always-on |
| Render Standard (AI) | $7/month | Always-on, more memory |
| **TOTAL** | | **$34/month** |

---

## 📊 Monitoring Your Deployment

### **Vercel Dashboard:**
- https://vercel.com/dashboard
- View deployments
- Check analytics
- Monitor bandwidth
- Set up custom domains

### **Render Dashboard:**
- https://dashboard.render.com
- View real-time logs
- Monitor resource usage
- Check deployment history
- Set up alerts

### **Uptime Monitoring:**
- https://uptimerobot.com
- Monitor all 3 services
- Get email alerts if down
- Keep Render services awake

---

## 🎨 Custom Domain (Optional)

### **Vercel:**
1. Go to Project Settings → Domains
2. Add your domain (e.g., `growmytrade.com`)
3. Follow DNS setup instructions
4. Free SSL included

### **Render:**
1. Go to Service Settings → Custom Domain
2. Add domain
3. Update DNS records
4. Free SSL included

---

## 🔄 Continuous Deployment

### **Automatic Updates:**

Every time you push to `main` branch:

1. ✅ Vercel auto-deploys frontend (~1 min)
2. ✅ Render auto-deploys backend (~3 min)
3. ✅ Render auto-deploys AI service (~5 min)

**Zero manual deployment!**

### **Deployment Flow:**

```bash
# Make changes
git add .
git commit -m "improved UI"
git push

# That's it! Vercel & Render handle the rest
```

---

## 🎯 Quick Reference

### **Service URLs:**

| Service | URL Pattern | Example |
|---------|-------------|---------|
| Frontend | `https://[project].vercel.app` | `https://grow-my-trade.vercel.app` |
| Backend | `https://[service].onrender.com` | `https://trading-signal-backend.onrender.com` |
| AI Service | `https://[service].onrender.com` | `https://trading-ai-service.onrender.com` |

### **Environment Variables:**

**Backend (Render):**
```
NEWSAPI_KEY=your_key
FINNHUB_KEY=your_key
AI_SERVICE_URL=https://trading-ai-service.onrender.com
JAVA_OPTS=-Xmx512m
ALLOWED_ORIGINS=*
```

**AI Service (Render):**
```
HF_TOKEN=hf_your_token
PORT=5000
```

**Frontend (Vercel):**
```
NEXT_PUBLIC_BACKEND_URL=https://trading-signal-backend.onrender.com/api
NEXT_PUBLIC_AI_SERVICE_URL=https://trading-ai-service.onrender.com
PLATFORM=vercel
```

---

## 📞 Need Help?

### **Check Logs:**

**Vercel:**
- Dashboard → Deployments → Click deployment → View logs

**Render:**
- Dashboard → Service → Logs tab

### **Test Endpoints:**

```bash
# Backend health
curl https://your-backend.onrender.com/api/health

# AI service health
curl https://your-ai-service.onrender.com/health

# Frontend
curl https://your-app.vercel.app
```

### **Common Resources:**

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Flask Docs](https://flask.palletsprojects.com)

---

## 🎉 Success Checklist

Once deployed, you should have:

- ✅ **Live Frontend**: `https://grow-my-trade.vercel.app`
- ✅ **Live Backend**: `https://trading-signal-backend.onrender.com`
- ✅ **Live AI Service**: `https://trading-ai-service.onrender.com`
- ✅ **All features working**
- ✅ **No console errors**
- ✅ **Custom domain** (optional)
- ✅ **Monitoring setup**
- ✅ **Auto-deployment on git push**

---

## 💡 Pro Tips

1. **Deploy in order**: Backend → AI Service → Frontend
2. **Test each service** before connecting
3. **Use UptimeRobot** to prevent Render spin-down
4. **Keep secrets safe**: Never commit API keys
5. **Monitor logs**: Catch issues early
6. **Test on mobile**: Ensure responsive design works
7. **Record a demo**: Backup in case of issues
8. **Practice your pitch**: Be ready to explain the architecture

---

## 🎓 For Hackathon Demo

**Recommended Setup:**

✅ **Local deployment** for live demo (faster)  
✅ **Cloud deployment** as backup (impressive!)  
✅ **Video recording** (ultimate backup)  
✅ **Screenshots** (for presentation)  

**Demo Script:**
1. Show live URL on Vercel
2. Demonstrate features
3. Explain architecture (3 services)
4. Show GitHub repository
5. Highlight auto-deployment

---

## 🚀 Deployment Commands

### **Check Deployment Status:**

```bash
# Test all services
curl https://trading-signal-backend.onrender.com/api/health
curl https://trading-ai-service.onrender.com/health
curl https://grow-my-trade.vercel.app

# View recent git commits
git log --oneline -5

# Check git status
git status
```

### **Trigger Redeployment:**

```bash
# Push empty commit to trigger deploy
git commit --allow-empty -m "trigger redeploy"
git push
```

---

**Ready to deploy? Start with Part 1!** 🚀

**Questions? Check the Troubleshooting section or ask me!** 💬
