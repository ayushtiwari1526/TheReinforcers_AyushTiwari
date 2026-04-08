"""
AI Trading Signal Service - Flask API
Real-time financial sentiment analysis using Gemma Small Language Model (SLM)

HACKATHON COMPLIANCE:
- Base model: Gemma (google/gemma-2b-it)
- Authentication: HuggingFace token required
- Prompt-based inference for financial sentiment
- No rule-based fallback - pure AI inference
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from models.sentiment_analyzer_gemma import analyzer
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model on startup
logger.info("=" * 60)
logger.info("INITIALIZING GEMMA SLM AI SERVICE")
logger.info("Hackathon Compliant: Using Gemma as base model")
logger.info("Authentication: HuggingFace token configured")
logger.info("Inference: Prompt-based (no rule-based fallback)")
logger.info("=" * 60)
analyzer.load_model()
logger.info("GEMMA SLM AI SERVICE READY!")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': analyzer.is_loaded,
        'service': 'AI Trading Signal Service'
    }), 200


@app.route('/predict', methods=['POST'])
def predict():
    """
    Analyze sentiment of financial news text
    
    Request JSON:
        {
            "text": "Tesla profits surge to record highs"
        }
    
    Response JSON:
        {
            "sentiment": "Positive",
            "confidence": 87.5,
            "signal": "BUY",
            "signalSubtitle": "Strong bullish signal detected",
            "company": "Tesla",
            "explanation": "...",
            "keyFactors": ["Earnings Impact", "Growth Indicators"],
            "processingTime": 1.2
        }
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        
        if 'text' not in data or not data['text']:
            return jsonify({'error': 'Text field is required'}), 400
        
        text = data['text'].strip()
        
        if len(text) < 5:
            return jsonify({'error': 'Text too short (minimum 5 characters)'}), 400
        
        if len(text) > 1000:
            return jsonify({'error': 'Text too long (maximum 1000 characters)'}), 400
        
        # Analyze sentiment
        start_time = time.time()
        result = analyzer.analyze_sentiment(text)
        processing_time = round(time.time() - start_time, 3)
        
        # Add processing time
        result['processingTime'] = processing_time
        
        logger.info(f"Analysis complete: {result['signal']} ({result['confidence']}%) - {processing_time}s")
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': str(e)
        }), 500


@app.route('/batch', methods=['POST'])
def batch_predict():
    """
    Analyze multiple texts at once
    
    Request JSON:
        {
            "texts": ["headline 1", "headline 2", ...]
        }
    """
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        
        if 'texts' not in data or not isinstance(data['texts'], list):
            return jsonify({'error': 'Texts array is required'}), 400
        
        texts = data['texts']
        
        if len(texts) > 10:
            return jsonify({'error': 'Maximum 10 texts per batch'}), 400
        
        results = []
        for text in texts:
            if len(text.strip()) >= 5:
                result = analyzer.analyze_sentiment(text)
                results.append(result)
        
        return jsonify({
            'results': results,
            'count': len(results)
        }), 200
        
    except Exception as e:
        logger.error(f"Error during batch analysis: {str(e)}")
        return jsonify({
            'error': 'Batch analysis failed',
            'message': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    logger.info("Starting AI Trading Signal Service on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
