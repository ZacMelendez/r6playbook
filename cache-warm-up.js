// Utility function to create a delay

// Function to fetch URLs from a sitemap
const fetchUrlsFromSitemap = async (sitemapUrl) => {
    const response = await fetch(sitemapUrl);
    const xml = await response.text();
    const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(match => match[1]);
    return urls;
};

// Function to crawl a URL and wait for a 200 response
const warmUpCache = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.text(); // Read the response body
        if (response.status === 200) {
            console.log(`Cached: ${url}`);
            console.log(`Data: ${data.substring(0, 10)}...`); // Log the first 100 characters of the data
        } else {
            console.error(`Failed: ${url} - Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error caching ${url}: ${error.message}`);
    }
};

// Main function
const main = async () => {
    const sitemapUrl = 'https://r6playbook.com/sitemap.xml'; // Replace with your sitemap URL
    const urls = await fetchUrlsFromSitemap(sitemapUrl);

    console.log(`Found ${urls.length} URLs in sitemap.`);

    // Fetch all URLs with delays, using Promise.all to start all delays concurrently
    await Promise.all(urls.map((url, index) => warmUpCache(url, index)));
    console.log('Cache warm-up complete!');
};

main();
