import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Web Scraping Ethics & Legal Considerations</h3>
          
          <div className="footer-info">
            <h4>When is scraping allowed?</h4>
            <p>Web scraping is generally allowed when:</p>
            <ul>
              <li>The website's Terms of Service explicitly permit it</li>
              <li>The data being scraped is publicly available</li>
              <li>You're not bypassing any authentication mechanisms</li>
              <li>You're not causing harm to the website's servers</li>
              <li>You're respecting rate limits and not overloading the server</li>
            </ul>
          </div>

          <div className="footer-info">
            <h4>Respecting robots.txt Rules</h4>
            <p>To respect a website's robots.txt rules:</p>
            <ul>
              <li>Always check the robots.txt file before scraping</li>
              <li>Respect the "Disallow" directives</li>
              <li>Follow the specified crawl-delay</li>
              <li>Use proper user-agent identification</li>
              <li>Implement rate limiting based on the site's requirements</li>
            </ul>
          </div>

          <div className="footer-info">
            <h4>Legal Alternatives for News Data</h4>
            <p>Consider these legal methods for obtaining news data:</p>
            <ul>
              <li>Official news APIs (e.g., NewsAPI, GDELT Project)</li>
              <li>RSS feeds provided by news websites</li>
              <li>News aggregation services with proper licensing</li>
              <li>Direct partnerships with news organizations</li>
              <li>Open data initiatives and public datasets</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} News Scraper. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 