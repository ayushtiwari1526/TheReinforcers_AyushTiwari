package com.trading.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AnalysisResponse {
    private String headline;
    private String company;
    private String sentiment;
    private String signal;
    private String signalSubtitle;
    private Double confidence;
    private SignalStrength strength;
    private String riskLevel;
    private String explanation;
    private List<String> keyFactors;
    private LocalDateTime timestamp;
    private Double processingTime;
}
