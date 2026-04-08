"""
Financial Sentiment Analyzer using FinBERT
Real AI model for financial news sentiment analysis
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import re


class SentimentAnalyzer:
    """AI-powered sentiment analyzer using FinBERT model"""
    
    def __init__(self):
        self.model_name = "ProsusAI/finbert"
        self.tokenizer = None
        self.model = None
        self.is_loaded = False
        
        # Company detection patterns
        self.companies = {
            'Tesla': r'\b(tesla|tsla|elon musk)\b',
            'Apple': r'\b(apple|aapl|iphone|tim cook)\b',
            'Microsoft': r'\b(microsoft|msft|azure|bill gates|satya nadella)\b',
            'Amazon': r'\b(amazon|amzn|jeff bezos)\b',
            'Google': r'\b(google|googl|alphabet|sundar pichai)\b',
            'Meta': r'\b(meta|fb|facebook|mark zuckerberg)\b',
            'Netflix': r'\b(netflix|nflx)\b',
            'NVIDIA': r'\b(nvidia|nvda|gpu|jen-hsun huang)\b',
            'Reliance': r'\b(reliance|ril|mukesh ambani)\b',
            'Tata': r'\b(tata|tcs|tata motors)\b',
            'Infosys': r'\b(infosys|infy)\b',
            'JPMorgan': r'\b(jpmorgan|jpm|jp morgan)\b',
            'Goldman Sachs': r'\b(goldman sachs|gs)\b',
            'Bank of America': r'\b(bank of america|bac|bofa)\b',
            'Walmart': r'\b(walmart|wmt)\b',
            'Bitcoin': r'\b(bitcoin|btc|crypto)\b',
            'TCS': r'\b(tcs|tata consultancy)\b'
        }
        
    def load_model(self):
        """Load FinBERT model (call once at startup)"""
        if not self.is_loaded:
            print("Loading FinBERT model... This may take a moment.")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
            self.is_loaded = True
            print("FinBERT model loaded successfully!")
    
    def detect_company(self, text):
        """Detect company name from text"""
        text_lower = text.lower()
        for company, pattern in self.companies.items():
            if re.search(pattern, text_lower):
                return company
        return None
    
    def analyze_sentiment(self, text):
        """
        Analyze sentiment of financial text using FinBERT
        
        Returns:
            dict: sentiment, confidence, signal, explanation, company
        """
        if not self.is_loaded:
            self.load_model()
        
        # Tokenize and predict
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # Get predictions
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)[0]
        predicted_class = torch.argmax(probabilities).item()
        
        # FinBERT labels: positive, negative, neutral
        labels = ['positive', 'negative', 'neutral']
        sentiment = labels[predicted_class]
        confidence = probabilities[predicted_class].item()
        
        # Map to trading signal
        signal, signal_subtitle = self._get_signal(sentiment, confidence)
        
        # Detect company
        company = self.detect_company(text)
        
        # Generate explanation
        explanation = self._generate_explanation(sentiment, confidence, company)
        
        # Extract key factors
        key_factors = self._extract_key_factors(text, sentiment)
        
        return {
            'sentiment': sentiment.capitalize(),
            'confidence': round(confidence * 100, 2),
            'signal': signal,
            'signalSubtitle': signal_subtitle,
            'company': company,
            'explanation': explanation,
            'keyFactors': key_factors
        }
    
    def _get_signal(self, sentiment, confidence):
        """Convert sentiment to trading signal"""
        if sentiment == 'positive':
            if confidence > 0.85:
                return 'BUY', 'Strong bullish signal detected'
            else:
                return 'BUY', 'Bullish momentum identified'
        elif sentiment == 'negative':
            if confidence > 0.85:
                return 'SELL', 'Strong bearish warning signal'
            else:
                return 'SELL', 'Bearish pressure detected'
        else:
            return 'HOLD', 'Wait for clearer direction'
    
    def _generate_explanation(self, sentiment, confidence, company):
        """Generate human-readable explanation"""
        company_text = f" for {company}" if company else ""
        
        if sentiment == 'positive':
            if confidence > 0.85:
                return f"FinBERT AI model detected strong positive sentiment{company_text} with {confidence*100:.1f}% confidence. Market indicators suggest bullish momentum with strong investor optimism and favorable financial outlook."
            else:
                return f"AI analysis shows positive sentiment{company_text} with {confidence*100:.1f}% confidence. Financial indicators lean bullish, suggesting potential upward movement based on news sentiment patterns."
        elif sentiment == 'negative':
            if confidence > 0.85:
                return f"FinBERT AI model identified strong negative sentiment{company_text} with {confidence*100:.1f}% confidence. Bearish signals dominate with investor concerns and unfavorable market conditions detected."
            else:
                return f"AI analysis reveals negative sentiment{company_text} with {confidence*100:.1f}% confidence. Financial indicators suggest downward pressure based on news sentiment analysis."
        else:
            return f"AI model detected neutral sentiment{company_text} with {confidence*100:.1f}% confidence. Mixed signals present with balanced positive and negative indicators. Market awaits clearer directional catalyst."
    
    def _extract_key_factors(self, text, sentiment):
        """Extract key factors from text"""
        factors = []
        text_lower = text.lower()
        
        # Positive factors
        if any(word in text_lower for word in ['earnings', 'profit', 'revenue']):
            factors.append('Earnings Impact')
        if any(word in text_lower for word in ['growth', 'expand', 'surge']):
            factors.append('Growth Indicators')
        if any(word in text_lower for word in ['innovation', 'launch', 'technology']):
            factors.append('Innovation Driver')
        if any(word in text_lower for word in ['upgrade', 'outperform', 'rating']):
            factors.append('Analyst Rating')
        
        # Negative factors
        if any(word in text_lower for word in ['loss', 'decline', 'fall']):
            factors.append('Revenue Concern')
        if any(word in text_lower for word in ['risk', 'concern', 'fear']):
            factors.append('Market Risk')
        if any(word in text_lower for word in ['regulation', 'investigation', 'fine']):
            factors.append('Regulatory Issue')
        
        # Default factors if none found
        if not factors:
            if sentiment == 'positive':
                factors = ['Positive Momentum', 'Bullish Sentiment']
            elif sentiment == 'negative':
                factors = ['Negative Pressure', 'Bearish Sentiment']
            else:
                factors = ['Mixed Signals', 'Neutral Outlook']
        
        return factors[:3]  # Return max 3 factors


# Singleton instance
analyzer = SentimentAnalyzer()
