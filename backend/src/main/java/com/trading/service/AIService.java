package com.trading.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {
    
    private static final Logger logger = LoggerFactory.getLogger(AIService.class);
    
    @Value("${ai.service.url}")
    private String aiServiceUrl;
    
    private final RestTemplate restTemplate;
    
    public AIService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Call Flask AI service to analyze sentiment
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> analyzeSentiment(String text) {
        logger.info("Calling AI service to analyze: {}", text.substring(0, Math.min(50, text.length())));
        
        String url = aiServiceUrl + "/predict";
        
        // Prepare request
        Map<String, String> request = new HashMap<>();
        request.put("text", text);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
        
        try {
            // Make POST request to Flask service
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                logger.info("AI service response received successfully");
                return response.getBody();
            } else {
                logger.error("AI service returned error status: {}", response.getStatusCode());
                throw new RuntimeException("AI service error: " + response.getStatusCode());
            }
            
        } catch (ResourceAccessException e) {
            logger.error("AI service is not accessible at {}. Is Flask running?", aiServiceUrl);
            throw new RuntimeException("AI service is not available. Please ensure the Python Flask service is running on port 5000.", e);
        } catch (Exception e) {
            logger.error("Error calling AI service: {}", e.getMessage());
            throw new RuntimeException("Failed to analyze sentiment: " + e.getMessage(), e);
        }
    }
    
    /**
     * Health check for AI service
     */
    public boolean isHealthy() {
        try {
            String url = aiServiceUrl + "/health";
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return response != null && "healthy".equals(response.get("status"));
        } catch (Exception e) {
            logger.warn("AI service health check failed: {}", e.getMessage());
            return false;
        }
    }
}
