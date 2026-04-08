package com.trading.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NewsArticle {
    private String title;
    private String source;
    private String url;
    private LocalDateTime publishedAt;
    private String description;
}
