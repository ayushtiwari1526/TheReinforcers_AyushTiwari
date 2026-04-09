# ☁️ Quick Deploy Checklist - Render + Vercel

> **Print this and check off each step!**

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub (`git push`)
- [ ] NewsAPI key obtained
- [ ] Finnhub key obtained  
- [ ] HuggingFace token obtained
- [ ] Render account created (GitHub login)
- [ ] Vercel account created (GitHub login)

---

## 🚀 Part 1: Backend on Render

- [ ] Created Web Service on Render
- [ ] Name: `trading-signal-backend`
- [ ] Root Directory: `backend`
- [ ] Runtime: Java
- [ ] Build Command: `mvn clean install -DskipTests`
- [ ] Start Command: `java -jar target/trading-signal-engine-1.0.0.jar`
- [ ] Added Environment Variables:
  - [ ] `NEWSAPI_KEY`
  - [ ] `FINNHUB_KEY`
  - [ ] `AI_SERVICE_URL` (temporary: `http://localhost:5000`)
  - [ ] `JAVA_OPTS=-Xmx512m`
  - [ ] `ALLOWED_ORIGINS=*`
- [ ] Deployment successful
- [ ] **Copied Backend URL**: `https://__________________.onrender.com`
- [ ] Tested: `/api/health` returns `{"status": "UP"}`

---

## 🤖 Part 2: AI Service on Render

- [ ] Created Web Service on Render
- [ ] Name: `trading-ai-service`
- [ ] Root Directory: `ai-service`
- [ ] Runtime: Python 3
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `python app.py`
- [ ] Added Environment Variables:
  - [ ] `HF_TOKEN`
  - [ ] `PORT=5000`
- [ ] Deployment successful (may take 5-10 min)
- [ ] **Copied AI Service URL**: `https://__________________.onrender.com`
- [ ] Tested: `/health` returns `{"model_loaded": true}`

---

## 🌐 Part 3: Frontend on Vercel

- [ ] Imported project on Vercel
- [ ] Project Name: `grow-my-trade`
- [ ] Root Directory: `./`
- [ ] Output Directory: `frontend`
- [ ] Added Environment Variables:
  - [ ] `NEXT_PUBLIC_BACKEND_URL` (Backend URL + `/api`)
  - [ ] `NEXT_PUBLIC_AI_SERVICE_URL` (AI Service URL)
  - [ ] `PLATFORM=vercel`
- [ ] Deployment successful
- [ ] **Copied Frontend URL**: `https://__________________.vercel.app`
- [ ] Tested: Homepage loads

---

## 🔗 Part 4: Connect Services

- [ ] Updated Backend `AI_SERVICE_URL` on Render
- [ ] Backend redeployed automatically
- [ ] Updated `frontend/api-config.js` with cloud URLs (if needed)
- [ ] Committed and pushed changes
- [ ] Vercel redeployed automatically

---

## ✅ Part 5: Testing

### **Service Health Checks:**

- [ ] Backend: `https://your-backend.onrender.com/api/health` ✅
- [ ] AI Service: `https://your-ai-service.onrender.com/health` ✅
- [ ] Frontend: `https://your-app.vercel.app` ✅

### **Feature Tests:**

- [ ] Homepage loads
- [ ] Dashboard page works
- [ ] News page loads articles
- [ ] "Analyze with AI" button works
- [ ] Market page shows charts
- [ ] About page displays
- [ ] Contact page displays
- [ ] Chatbot appears and responds
- [ ] Navigation works between pages
- [ ] No console errors (F12)

### **Mobile Tests:**

- [ ] Responsive on mobile
- [ ] All features work on mobile
- [ ] Charts display on mobile

---

## 🎨 Optional: Custom Domain

- [ ] Purchased domain (e.g., growmytrade.com)
- [ ] Added domain to Vercel
- [ ] Updated DNS records
- [ ] SSL certificate issued
- [ ] Domain working: `https://growmytrade.com`

---

## 📊 Monitoring Setup

- [ ] Signed up for UptimeRobot
- [ ] Added monitor for Backend URL
- [ ] Added monitor for AI Service URL
- [ ] Email alerts configured
- [ ] Monitoring every 5 minutes

---

## 🎯 Demo Preparation

- [ ] Live URL bookmarked
- [ ] Tested on different browsers
- [ ] Tested on mobile device
- [ ] Backup video recorded
- [ ] Screenshots taken
- [ ] Demo script practiced
- [ ] Architecture diagram ready

---

## 📝 Final Checklist

- [ ] All API keys working
- [ ] No sensitive data in code
- [ ] `.gitignore` includes `.env` files
- [ ] README updated with live URL
- [ ] Repository is public (for judges)
- [ ] Auto-deployment working
- [ ] Team members have access

---

## 🎉 Deployment Complete!

**Your Live URLs:**

```
Frontend:  https://__________________.vercel.app
Backend:   https://__________________.onrender.com
AI Service: https://__________________.onrender.com
```

**Share your app:** `https://__________________.vercel.app`

---

## 📞 Quick Commands

```bash
# Check deployment status
git status
git log --oneline -3

# Trigger redeployment
git commit --allow-empty -m "trigger redeploy"
git push

# Test endpoints
curl https://your-backend.onrender.com/api/health
curl https://your-ai-service.onrender.com/health
```

---

**Deployed Successfully?** Share the URL! 🚀

**Issues?** Check RENDER_VERCEL_DEPLOYMENT.md Troubleshooting section
