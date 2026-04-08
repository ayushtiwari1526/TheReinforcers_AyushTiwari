package com.trading.service;

import com.trading.model.NewsArticle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class NewsService {
    
    private static final Logger logger = LoggerFactory.getLogger(NewsService.class);
    
    @Value("${newsapi.key}")
    private String newsApiKey;
    
    @Value("${finnhub.key}")
    private String finnhubApiKey;
    
    private final RestTemplate restTemplate;
    
    public NewsService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Fetch latest financial news
     * Tries NewsAPI first, falls back to Finnhub
     */
    public List<NewsArticle> fetchLatestNews() {
        logger.info("Fetching latest financial news...");
        
        // Try NewsAPI first
        List<NewsArticle> articles = fetchFromNewsAPI();
        
        if (!articles.isEmpty()) {
            logger.info("Successfully fetched {} articles from NewsAPI", articles.size());
            return articles;
        }
        
        // Fallback to Finnhub
        logger.warn("NewsAPI failed, trying Finnhub...");
        articles = fetchFromFinnhub();
        
        if (!articles.isEmpty()) {
            logger.info("Successfully fetched {} articles from Finnhub", articles.size());
            return articles;
        }
        
        logger.error("Both news APIs failed to fetch articles");
        return Collections.emptyList();
    }
    
    /**
     * Fetch from NewsAPI.org
     */
    private List<NewsArticle> fetchFromNewsAPI() {
        try {
            String url = "https://newsapi.org/v2/everything?" +
                        "q=finance+stock+market&" +
                        "sortBy=publishedAt&" +
                        "pageSize=5&" +
                        "language=en&" +
                        "apiKey=" + newsApiKey;
            
            Map response = restTemplate.getForObject(url, Map.class);
            
            if (response == null || !"ok".equals(response.get("status"))) {
                logger.warn("NewsAPI returned error response");
                return Collections.emptyList();
            }
            
            List<Map> articlesMap = (List<Map>) response.get("articles");
            List<NewsArticle> articles = new ArrayList<>();
            
            DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
            
            for (Map articleMap : articlesMap) {
                NewsArticle article = new NewsArticle();
                article.setTitle((String) articleMap.get("title"));
                article.setDescription((String) articleMap.get("description"));
                article.setUrl((String) articleMap.get("url"));
                
                Map source = (Map) articleMap.get("source");
                article.setSource(source != null ? (String) source.get("name") : "Unknown");
                
                String publishedAt = (String) articleMap.get("publishedAt");
                if (publishedAt != null) {
                    article.setPublishedAt(LocalDateTime.parse(publishedAt, formatter));
                }
                
                articles.add(article);
            }
            
            return articles;
            
        } catch (Exception e) {
            logger.error("Error fetching from NewsAPI: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Fetch from Finnhub API
     */
    private List<NewsArticle> fetchFromFinnhub() {
        try {
            String url = "https://finnhub.io/api/v1/news?category=general&token=" + finnhubApiKey;
            
            List<Map> articlesMap = restTemplate.getForObject(url, List.class);
            
            if (articlesMap == null || articlesMap.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<NewsArticle> articles = new ArrayList<>();
            
            for (int i = 0; i < Math.min(5, articlesMap.size()); i++) {
                Map articleMap = articlesMap.get(i);
                
                NewsArticle article = new NewsArticle();
                article.setTitle((String) articleMap.get("headline"));
                article.setDescription((String) articleMap.get("summary"));
                article.setUrl((String) articleMap.get("url"));
                article.setSource((String) articleMap.get("source"));
                
                Long datetime = (Long) articleMap.get("datetime");
                if (datetime != null) {
                    article.setPublishedAt(
                        LocalDateTime.ofEpochSecond(datetime, 0, java.time.ZoneOffset.UTC)
                    );
                }
                
                articles.add(article);
            }
            
            return articles;
            
        } catch (Exception e) {
            logger.error("Error fetching from Finnhub: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
