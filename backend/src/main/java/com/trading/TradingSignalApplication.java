package com.trading;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class TradingSignalApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(TradingSignalApplication.class);
    
    public static void main(String[] args) {
        logger.info("========================================");
        logger.info("Starting AI Trading Signal Engine...");
        logger.info("========================================");
        
        SpringApplication.run(TradingSignalApplication.class, args);
        
        logger.info("========================================");
        logger.info("AI Trading Signal Engine is READY!");
        logger.info("Server running on: http://localhost:8080");
        logger.info("API Endpoints:");
        logger.info("  POST /api/analyze - Analyze headline");
        logger.info("  GET  /api/news/latest - Fetch latest news");
        logger.info("  GET  /api/health - Health check");
        logger.info("========================================");
    }
}
