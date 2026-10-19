/**
 * Submit canonical YiwuBridge URLs to IndexNow.
 * Usage: node scripts/submit-indexnow.js
 */
'use strict';

const https = require('https');

const HOST = 'yiwugoagent.com';
const KEY = 'yiwugoagent2026indexkey';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/blog/how-to-buy-from-yiwu-market-sourcing-agent-guide-2026.html`
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST
});

const request = https.request(
  {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  (response) => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { body += chunk; });
    response.on('end', () => {
      console.log(`IndexNow response status: ${response.statusCode}`);
      if (body) console.log(body);
      if (response.statusCode === 200 || response.statusCode === 202) {
        console.log(`[SUCCESS] Submitted ${URL_LIST.length} canonical URL(s) to IndexNow.`);
      } else {
        console.error('[ERROR] IndexNow did not accept the submission. Verify the live key file, host, and canonical URLs.');
        process.exitCode = 1;
      }
    });
  }
);

request.setTimeout(20000, () => request.destroy(new Error('IndexNow request timed out')));
request.on('error', (error) => {
  console.error('[ERROR] Failed to submit URLs to IndexNow:', error.message);
  process.exitCode = 1;
});
request.write(payload);
request.end();
