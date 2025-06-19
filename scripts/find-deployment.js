#!/usr/bin/env node

import https from 'https';
import http from 'http';

// Expanded list of possible DigitalOcean URL patterns
const possibleUrls = [
  // Original URLs from conversation
  'https://oyster-app-wqf7o.ondigitalocean.app',
  'https://tellyousomeday-fullstack-wqf7o.ondigitalocean.app',
  
  // Common DigitalOcean patterns  
  'https://tellyousomeday-fullstack-4x8mv.ondigitalocean.app',
  'https://tellyousomeday-fullstack-2k9dn.ondigitalocean.app',
  'https://tellyousomeday-fullstack-hdxgp.ondigitalocean.app',
  'https://tellyousomeday-fullstack-8kj3m.ondigitalocean.app',
  'https://tellyousomeday-fullstack-7gf2n.ondigitalocean.app',
  'https://tellyousomeday-fullstack-9pl4r.ondigitalocean.app',
  
  // With web- prefix
  'https://web-tellyousomeday-fullstack-wqf7o.ondigitalocean.app',
  'https://web-tellyousomeday-fullstack-4x8mv.ondigitalocean.app',
  'https://web-tellyousomeday-fullstack-2k9dn.ondigitalocean.app',
  
  // Alternative naming patterns
  'https://tellyousomeday-wqf7o.ondigitalocean.app',
  'https://tellyousomeday-4x8mv.ondigitalocean.app',
  'https://tellyousomeday-2k9dn.ondigitalocean.app',
  
  // Recently common pattern
  'https://app-tellyousomeday-fullstack-wqf7o.ondigitalocean.app',
  'https://app-tellyousomeday-fullstack-4x8mv.ondigitalocean.app',
  
  // Single letter variations for recent deployments
  'https://tellyousomeday-fullstack-a1b2c.ondigitalocean.app',
  'https://tellyousomeday-fullstack-x3y4z.ondigitalocean.app',
  'https://tellyousomeday-fullstack-m5n6p.ondigitalocean.app',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const healthUrl = `${url}/api/health`;
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(healthUrl, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url: healthUrl,
          baseUrl: url,
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url: healthUrl,
        baseUrl: url,
        success: false,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: healthUrl,
        baseUrl: url,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function checkAllUrls() {
  console.log('🔍 Checking expanded list of possible DigitalOcean deployment URLs...\n');
  
  const results = [];
  
  for (const baseUrl of possibleUrls) {
    process.stdout.write(`Checking: ${baseUrl.replace('https://', '').substring(0, 40)}... `);
    const result = await checkUrl(baseUrl);
    
    if (result.success) {
      console.log(`✅ FOUND!`);
      console.log(`\n🎉 WORKING DEPLOYMENT FOUND!`);
      console.log(`📍 Base URL: ${baseUrl}`);
      console.log(`🏥 Health endpoint: ${baseUrl}/api/health`);
      console.log(`🌐 Frontend: ${baseUrl}`);
      console.log(`📊 Health Response:`, result.data);
      
      // Test message creation too
      console.log(`\n🧪 Testing message creation...`);
      await testMessageCreation(baseUrl);
      
      return baseUrl;
    } else {
      console.log(`❌`);
    }
    
    results.push(result);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n❌ No working deployment found in expanded search!');
  console.log('\n📊 Summary of failures:');
  const errorCounts = {};
  results.forEach(r => {
    if (!r.success) {
      const error = r.error || 'Unknown';
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    }
  });
  
  Object.entries(errorCounts).forEach(([error, count]) => {
    console.log(`   ${error}: ${count} URLs`);
  });
  
  console.log('\n💡 Next steps:');
  console.log('   1. Check DigitalOcean dashboard - the app might have failed to deploy');
  console.log('   2. Check GitHub Actions - deployment might be stuck');
  console.log('   3. Create a new DigitalOcean App with a fresh name');
  console.log('   4. Check if the .do/fullstack-app.yaml config is correct');
  
  return null;
}

async function testMessageCreation(baseUrl) {
  return new Promise((resolve) => {
    const testData = JSON.stringify({
      senderName: "Test User",
      recipientType: "world", 
      message: "Hello from deployment test!"
    });
    
    const options = {
      hostname: baseUrl.replace('https://', ''),
      port: 443,
      path: '/api/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testData.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Message creation test: SUCCESS (${res.statusCode})`);
          console.log(`📝 Response: ${data.substring(0, 100)}...`);
        } else {
          console.log(`⚠️ Message creation test: HTTP ${res.statusCode}`);
          console.log(`📝 Response: ${data.substring(0, 100)}...`);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Message creation test failed: ${err.message}`);
      resolve();
    });
    
    req.write(testData);
    req.end();
  });
}

async function main() {
  console.log('🚀 TellYouSomeday Deployment Discovery Tool');
  console.log('==========================================\n');
  
  const workingUrl = await checkAllUrls();
  
  if (workingUrl) {
    console.log('\n🎉 SUCCESS! Your deployment is working.');
    console.log(`\n📋 Use this URL in your frontend: ${workingUrl}`);
    console.log(`\n🔧 To test manually:`);
    console.log(`   Frontend: ${workingUrl}`);
    console.log(`   API Health: ${workingUrl}/api/health`);
    console.log(`   Create Message: POST ${workingUrl}/api/messages`);
  } else {
    console.log('\n❌ No working deployment found. Please check DigitalOcean dashboard.');
  }
}

main().catch(console.error);
