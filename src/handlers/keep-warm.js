const fetch = require('node-fetch');

module.exports.handler = async function() {
  const keepWarmUrls = process.env['EndPointUrls'];
  const keepWarmUrlsArray = typeof keepWarmUrls === 'string' && keepWarmUrls.split(';');

  if (keepWarmUrlsArray && keepWarmUrlsArray.length) {
    const INTERVAL_TIMEOUT = 540000 // 9 minutes
    
    setInterval(function() { 
      keepWarmUrlsArray.forEach(async function(url) {
        const data = await fetch(url).then(res => res.json());
        if (data) {
          console.info(data);
        } else {
          console.error(`Error calling endpoint: ${url}`);
        }
      });
    }, INTERVAL_TIMEOUT);
  }
};
