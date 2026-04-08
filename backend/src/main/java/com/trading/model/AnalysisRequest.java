package com.trading.model;

import lombok.Data;

@Data
public class AnalysisRequest {
    private String headline;
    private Boolean fetchLatest = false;
}
