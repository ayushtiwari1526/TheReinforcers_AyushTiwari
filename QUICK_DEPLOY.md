# 🚀 Quick Start - Deploy in 5 Minutes

## 📋 What You Need (All FREE):

1. ✅ **Java 17+** → Already installed ✓
2. ✅ **Python 3.8+** → Already installed ✓
3. ✅ **Code** → Already on your computer ✓

---

## 🎯 Step 1: Get API Keys (5 minutes)

### **Required (3 keys):**

| API | Where to Get | Time |
|-----|-------------|------|
| **HuggingFace Token** | https://huggingface.co/settings/tokens | 1 min |
| **NewsAPI Key** | https://newsapi.org/register | 2 min |
| **Finnhub Key** | https://finnhub.io/register | 2 min |

### **Optional:**
- **OpenAI Key** (for chatbot) → https://platform.openai.com/api-keys
  - Demo mode works without it!

---

## ⚙️ Step 2: Configure (1 minute)

### **A. Set HuggingFace Token:**

Open PowerShell and run:
```powershell
$env:HF_TOKEN = "hf_your_token_here"
```

### **B. Update Backend Config:**

Edit: `backend/src/main/resources/application.properties`

```properties
newsapi.key=your_newsapi_key_here
finnhub.key=your_finnhub_key_here
```

---

## 🚀 Step 3: Start Everything (2 minutes)

### **Run the setup script:**

```powershell
# Double-click or run:
.\deploy.bat
```

This will:
- ✅ Check Java & Python
- ✅ Install dependencies
- ✅ Build backend (if needed)
- ✅ Prepare everything

### **Then start all servers:**

```powershell
# Just say to me: "start all servers"
# I'll handle everything!
```

---

## 🌐 Step 4: Open Your App

Visit: **http://localhost:3000**

**That's it!** 🎉

---

## 📱 Want to Deploy to Cloud?

### **Easiest Option (Free):**

1. **Frontend** → Netlify (drag & drop)
2. **Backend** → Render.com (connect GitHub)
3. **AI Service** → Render.com (connect GitHub)

**See full guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| AI service won't start | Check HF_TOKEN is set |
| News not loading | Verify API keys |
| Port in use | Run `taskkill /F /IM java.exe /IM python.exe` |
| Chatbot demo mode | That's OK! Works for demos |

---

## 🎓 For Hackathon Demo

**Recommended: Local Deployment**

✅ No internet needed  
✅ Fast responses  
✅ Free  
✅ Easy to debug  

**Backup:** Record a video demo just in case!

---

## 📞 Quick Help

**To start servers, just tell me:**
- "start all servers"
- "restart everything"
- "check server status"

**I'll handle the rest!** 🤖

---

**Need the full guide?** → See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
