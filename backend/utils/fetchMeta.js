const axios = require('axios');
const cheerio = require('cheerio');

async function fetchWithRetry(url, options = {}, retries = 2) {
  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    ...options.headers
  };

  try {
    if (retries < 2) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    }

    return await axios({
      ...options,
      url,
      headers: browserHeaders,
      maxRedirects: 5,
      validateStatus: status => status < 500,
      timeout: 15000
    });
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying request to ${url}, ${retries} attempts left`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

async function getJinaSummary(url) {
  try {
    console.log('Requesting summary from Jina AI for URL:', url);
    const encodedUrl = encodeURIComponent(url);
    const jinaUrl = `https://r.jina.ai/http://${encodedUrl}`;
    
    console.log('Using Jina AI URL:', jinaUrl);
    const response = await fetchWithRetry(jinaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain'
      }
    });

    if (response.data) {
      // Clean up the summary - remove extra whitespace and limit length
      const summary = response.data.toString()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);
        
      if (summary.length > 50) {
        console.log('Successfully got summary from Jina AI');
        return summary;
      }
    }
    throw new Error('Summary too short or empty');
  } catch (error) {
    console.error('Jina AI Error:', error.message);
    throw error;
  }
}

async function extractMetadata(url) {
  try {
    const response = await fetchWithRetry(url);
    const $ = cheerio.load(response.data);
    
    // Get title from multiple sources
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      url;

    // Get favicon from multiple sources
    let favicon = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico';

    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = urlObj.origin + (favicon.startsWith('/') ? favicon : '/' + favicon);
    }

    // Get meta description as backup
    const description = 
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content');

    return { title, favicon, description };
  } catch (error) {
    console.log('Error extracting metadata:', error.message);
    return { title: url, favicon: '', description: '' };
  }
}

async function fetchMeta(url) {
  console.log('Starting fetchMeta for URL:', url);
  
  try {
    // First, try to get metadata (title, favicon, and description)
    const { title, favicon, description } = await extractMetadata(url);
    
    // Then, try to get summary from Jina AI
    let summary = '';
    try {
      summary = await getJinaSummary(url);
    } catch (jinaError) {
      console.log('Jina AI summary failed, falling back to meta description');
      
      if (description) {
        summary = description;
      } else {
        // If no meta description, try to get content directly
        try {
          const response = await fetchWithRetry(url);
          const $ = cheerio.load(response.data);
          
          // Try to get first few meaningful paragraphs
          const paragraphs = $('p').map((_, el) => $(el).text().trim())
            .get()
            .filter(text => text.length > 50)
            .slice(0, 3)
            .join(' ');
            
          if (paragraphs) {
            summary = paragraphs;
          } else {
            summary = 'No summary available. Please visit the website to view the content.';
          }
        } catch (error) {
          summary = 'Could not generate summary. Please visit the website to view the content.';
        }
      }
    }
    
    console.log('Final result:', {
      title,
      summary: summary.slice(0, 50) + '...',
      contentLength: summary.length
    });
    
    return { title, favicon, summary };
  } catch (error) {
    console.error('Error in fetchMeta:', error.message);
    return {
      title: url,
      favicon: '',
      summary: 'Could not fetch content. Please visit the website directly.'
    };
  }
}

module.exports = fetchMeta; 