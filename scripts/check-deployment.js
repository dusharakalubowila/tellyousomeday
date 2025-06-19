#!/usr/bin/env node

import https from 'https';
import http from 'http';

// Common DigitalOcean URL patterns to try
const possibleUrls = [
  'https://oyster-app-wqf7o.ondigitalocean.app',
  'https://tellyousomeday-fullstack-wqf7o.ondigitalocean.app',
  'https://tellyousomeday-fullstack-4x8mv.ondigitalocean.app',
  'https://tellyousomeday-fullstack-2k9dn.ondigitalocean.app',
  'https://tellyousomeday-fullstack-hdxgp.ondigitalocean.app',
  'https://web-tellyousomeday-fullstack-wqf7o.ondigitalocean.app',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const healthUrl = `${url}/api/health`;
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(healthUrl, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url: healthUrl,
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url: healthUrl,
        success: false,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: healthUrl,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function checkAllUrls() {
  console.log('🔍 Checking possible DigitalOcean deployment URLs...\n');
  
  for (const baseUrl of possibleUrls) {
    console.log(`Checking: ${baseUrl}/api/health`);
    const result = await checkUrl(baseUrl);
    
    if (result.success) {
      console.log(`✅ FOUND WORKING DEPLOYMENT!`);
      console.log(`📍 URL: ${baseUrl}`);
      console.log(`🏥 Health endpoint: ${baseUrl}/api/health`);
      console.log(`🌐 Frontend: ${baseUrl}`);
      console.log(`📊 Response:`, result.data);
      return baseUrl;
    } else {
      console.log(`❌ Failed: ${result.error || result.status}`);
    }
  }
  
  console.log('\n❌ No working deployment found!');
  console.log('📝 This could mean:');
  console.log('   1. The deployment failed or is not ready yet');
  console.log('   2. The URL has changed');
  console.log('   3. The health endpoint is not responding');
  console.log('\n💡 Next steps:');
  console.log('   1. Check DigitalOcean dashboard for deployment status');
  console.log('   2. Trigger a new deployment by pushing to GitHub');
  console.log('   3. Check deployment logs for errors');
  
  return null;
}

async function main() {
  const workingUrl = await checkAllUrls();
  
  if (workingUrl) {
    console.log('\n🎉 Deployment is working!');
    console.log(`\n🧪 Test message creation:`);
    console.log(`curl -X POST "${workingUrl}/api/messages" \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"senderName":"Test","recipientType":"world","message":"Hello from script!"}'`);
  }
}

main().catch(console.error);
