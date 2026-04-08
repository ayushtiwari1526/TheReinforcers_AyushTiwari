package com.trading.service;

import com.trading.model.AnalysisResponse;
import com.trading.model.SignalStrength;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SignalService {
    
    private static final Logger logger = LoggerFactory.getLogger(SignalService.class);
    
    private final AIService aiService;
    
    public SignalService(AIService aiService) {
        this.aiService = aiService;
    }
    
    /**
     * Analyze headline and generate trading signal
     */
    @SuppressWarnings("unchecked")
    public AnalysisResponse analyzeHeadline(String headline) {
        logger.info("Analyzing headline: {}", headline);
        
        try {
            // Call AI service
            Map<String, Object> aiResult = aiService.analyzeSentiment(headline);
            
            // Build response
            AnalysisResponse response = new AnalysisResponse();
            response.setHeadline(headline);
            response.setTimestamp(LocalDateTime.now());
            
            // Extract AI results
            response.setSentiment((String) aiResult.get("sentiment"));
            response.setSignal((String) aiResult.get("signal"));
            response.setSignalSubtitle((String) aiResult.get("signalSubtitle"));
            response.setCompany((String) aiResult.get("company"));
            response.setExplanation((String) aiResult.get("explanation"));
            response.setKeyFactors((List<String>) aiResult.get("keyFactors"));
            
            // Confidence
            Double confidence = ((Number) aiResult.get("confidence")).doubleValue();
            response.setConfidence(confidence);
            
            // Calculate signal strength
            response.setStrength(calculateSignalStrength(confidence));
            
            // Calculate risk level
            response.setRiskLevel(calculateRiskLevel(confidence));
            
            // Processing time
            if (aiResult.containsKey("processingTime")) {
                response.setProcessingTime(((Number) aiResult.get("processingTime")).doubleValue());
            }
            
            logger.info("Analysis complete: Signal={}, Confidence={}%, Strength={}", 
                       response.getSignal(), response.getConfidence(), response.getStrength());
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error during analysis: {}", e.getMessage(), e);
            throw new RuntimeException("Analysis failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Calculate signal strength based on confidence
     */
    private SignalStrength calculateSignalStrength(double confidence) {
        if (confidence > 85.0) {
            return SignalStrength.STRONG;
        } else if (confidence >= 70.0) {
            return SignalStrength.MODERATE;
        } else {
            return SignalStrength.WEAK;
        }
    }
    
    /**
     * Calculate risk level based on confidence
     */
    private String calculateRiskLevel(double confidence) {
        if (confidence > 85.0) {
            return "Low";
        } else if (confidence >= 75.0) {
            return "Medium";
        } else {
            return "High";
        }
    }
}
