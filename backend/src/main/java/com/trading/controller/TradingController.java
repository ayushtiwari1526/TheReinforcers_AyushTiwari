package com.trading.controller;

import com.trading.model.AnalysisRequest;
import com.trading.model.AnalysisResponse;
import com.trading.model.NewsArticle;
import com.trading.service.NewsService;
import com.trading.service.SignalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TradingController {
    
    private static final Logger logger = LoggerFactory.getLogger(TradingController.class);
    
    private final SignalService signalService;
    private final NewsService newsService;
    
    public TradingController(SignalService signalService, NewsService newsService) {
        this.signalService = signalService;
        this.newsService = newsService;
    }
    
    /**
     * Analyze financial news headline
     * POST /api/analyze
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody AnalysisRequest request) {
        try {
            // Validate request
            if (request.getHeadline() == null || request.getHeadline().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Headline is required",
                    "message", "Please provide a financial news headline to analyze"
                ));
            }
            
            String headline = request.getHeadline().trim();
            
            if (headline.length() < 10) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Headline too short",
                    "message", "Headline must be at least 10 characters long"
                ));
            }
            
            logger.info("Received analysis request for headline: {}", headline);
            
            // Analyze headline
            AnalysisResponse response = signalService.analyzeHeadline(headline);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Analysis failed: {}", e.getMessage(), e);
            
            if (e.getMessage().contains("AI service is not available")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "error", "AI Service Unavailable",
                    "message", "The Python Flask AI service is not running. Please start it on port 5000.",
                    "solution", "Run: python ai-service/app.py"
                ));
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Analysis Failed",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Fetch latest financial news
     * GET /api/news/latest
     */
    @GetMapping("/news/latest")
    public ResponseEntity<?> getLatestNews() {
        try {
            logger.info("Fetching latest financial news...");
            
            List<NewsArticle> articles = newsService.fetchLatestNews();
            
            if (articles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "error", "News APIs Unavailable",
                    "message", "Unable to fetch news. Please check your API keys in application.properties",
                    "solution", "Add valid API keys for NewsAPI.org or Finnhub.io"
                ));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("articles", articles);
            response.put("count", articles.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to fetch news: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to Fetch News",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Fetch latest financial news (simplified endpoint)
     * GET /news
     */
    @GetMapping("/news")
    public ResponseEntity<?> getNews() {
        try {
            logger.info("Fetching news via /news endpoint...");
            
            List<NewsArticle> articles = newsService.fetchLatestNews();
            
            if (articles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "error", "No articles found",
                    "message", "Unable to fetch news from NewsAPI"
                ));
            }
            
            return ResponseEntity.ok(articles);
            
        } catch (Exception e) {
            logger.error("Failed to fetch news: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to Fetch News",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/health
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "AI Trading Signal Engine");
        health.put("timestamp", java.time.LocalDateTime.now());
        
        // Check AI service
        try {
            boolean aiHealthy = signalService.analyzeHeadline("test") != null;
            health.put("aiService", aiHealthy ? "UP" : "DOWN");
        } catch (Exception e) {
            health.put("aiService", "DOWN");
            health.put("aiServiceMessage", "Flask service not accessible on port 5000");
        }
        
        return ResponseEntity.ok(health);
    }
}
