
-- npx wrangler d1 execute kesim --local --file=assets/db/populate.sql

-- Fill links table with some data.

INSERT INTO links
  (slug, url)
VALUES
  ('google', 'https://www.google.com'),
  ('amazon', 'https://www.amazon.com'),
  ('apple', 'https://www.apple.com'),
  ('bing', 'https://bing.com'),
  ('duckduckgo', 'https://duckduckgo.com'),
  ('facebook', 'https://www.facebook.com'),
  ('drive', 'https://drive.google.com'),
  ('instagram', 'https://www.instagram.com'),
  ('wikipedia', 'https://www.wikipedia.org'),
  ('twitter', 'https://www.twitter.com'),
  ('xcom', 'https://x.com'),
  ('ko-fi', 'https://www.ko-fi.com'),
  ('linkedin', 'https://www.linkedin.com'),
  ('whatsapp', 'https://www.whatsapp.com'),
  ('netflix', 'https://www.netflix.com'),
  ('twitch', 'https://www.twitch.tv'),
  ('ebay', 'https://www.ebay.com'),
  ('pinterest', 'https://www.pinterest.com'),
  ('microsoft', 'https://www.microsoft.com'),
  ('baidu', 'https://www.baidu.com'),
  ('yahoo', 'https://www.yahoo.com'),
  ('aliexpress', 'https://www.aliexpress.com'),
  ('live', 'https://www.live.com'),
  ('yandex', 'https://www.yandex.ru'),
  ('samsung', 'https://www.samsung.com'),
  ('stackoverflow', 'https://www.stackoverflow.com'),
  ('bing', 'https://www.bing.com'),
  ('quora', 'https://www.quora.com'),
  ('bbc', 'https://www.bbc.com'),
  ('cnn', 'https://www.cnn.com'),
  ('guardian', 'https://www.theguardian.com'),
  ('reuters', 'https://www.reuters.com'),
  ('forbes', 'https://www.forbes.com'),
  ('bloomberg', 'https://www.bloomberg.com'),
  ('wsj', 'https://www.wsj.com'),
  ('cnbc', 'https://www.cnbc.com'),
  ('msn', 'https://www.msn.com'),
  ('foxnews', 'https://www.foxnews.com'),
  ('aljazeera', 'https://www.aljazeera.com'),
  ('buzzfeed', 'https://www.buzzfeed.com'),
  ('drudgereport', 'https://www.drudgereport.com'),
  ('yahoofinance', 'https://finance.yahoo.com'),
  ('businessinsider', 'https://www.businessinsider.com'),
  ('medium', 'https://www.medium.com'),
  ('dropbox', 'https://www.dropbox.com'),
  ('slack', 'https://www.slack.com'),
  ('zoom', 'https://www.zoom.us'),
  ('paypal', 'https://www.paypal.com'),
  ('stripe', 'https://www.stripe.com'),
  ('salesforce', 'https://www.salesforce.com'),
  ('adobe', 'https://www.adobe.com'),
  ('spotify', 'https://www.spotify.com'),
  ('soundcloud', 'https://www.soundcloud.com'),
  ('pandora', 'https://www.pandora.com'),
  ('hulu', 'https://www.hulu.com'),
  ('disneyplus', 'https://www.disneyplus.com'),
  ('primevideo', 'https://www.primevideo.com'),
  ('imdb', 'https://www.imdb.com'),
  ('rottentomatoes', 'https://www.rottentomatoes.com'),
  ('flickr', 'https://www.flickr.com'),
  ('deviantart', 'https://www.deviantart.com'),
  ('tumblr', 'https://www.tumblr.com'),
  ('wordpress', 'https://www.wordpress.com'),
  ('medium', 'https://www.medium.com'),
  ('blogger', 'https://www.blogger.com'),
  ('tripadvisor', 'https://www.tripadvisor.com'),
  ('yelp', 'https://www.yelp.com'),
  ('airbnb', 'https://www.airbnb.com'),
  ('booking', 'https://www.booking.com'),
  ('expedia', 'https://www.expedia.com'),
  ('uber', 'https://www.uber.com'),
  ('lyft', 'https://www.lyft.com'),
  ('walmart', 'https://www.walmart.com'),
  ('costco', 'https://www.costco.com'),
  ('target', 'https://www.target.com'),
  ('bestbuy', 'https://www.bestbuy.com'),
  ('homedepot', 'https://www.homedepot.com'),
  ('lowes', 'https://www.lowes.com'),
  ('shopify', 'https://www.shopify.com'),
  ('etsy', 'https://www.etsy.com'),
  ('kickstarter', 'https://www.kickstarter.com'),
  ('gofundme', 'https://www.gofundme.com'),
  ('patreon', 'https://www.patreon.com'),
  ('craigslist', 'https://www.craigslist.org'),
  ('indeed', 'https://www.indeed.com'),
  ('monster', 'https://www.monster.com'),
  ('glassdoor', 'https://www.glassdoor.com'),
  ('ziprecruiter', 'https://www.ziprecruiter.com'),
  ('careerbuilder', 'https://www.careerbuilder.com'),
  ('upwork', 'https://www.upwork.com'),
  ('fiverr', 'https://www.fiverr.com')
ON CONFLICT(slug) DO UPDATE SET url=excluded.url;
