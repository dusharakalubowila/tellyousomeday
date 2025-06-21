#!/usr/bin/env node

import https from 'https';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(url, expectedStatus = 200) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === expectedStatus;
        resolve({
          url,
          status: res.statusCode,
          success,
          data: data.substring(0, 200),
          contentType: res.headers['content-type']
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        success: false,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function testMessageCreation(baseUrl) {
  return new Promise((resolve) => {
    const testData = JSON.stringify({
      senderName: "Test User",
      recipientType: "world",
      message: "Hello from fresh deployment test!"
    });
    
    const url = new URL('/api/messages', baseUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
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
        resolve({
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: data
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message
      });
    });
    
    req.write(testData);
    req.end();
  });
}

async function fullDeploymentTest(baseUrl) {
  log('blue', '🚀 Testing Fresh DigitalOcean Deployment');
  log('blue', '=====================================');
  console.log(`🌐 Base URL: ${baseUrl}\n`);
  
  const tests = [
    {
      name: 'Frontend (React App)',
      url: baseUrl,
      expectedStatus: 200
    },
    {
      name: 'API Health Check',
      url: `${baseUrl}/api/health`,
      expectedStatus: 200
    },
    {
      name: 'API Test Endpoint',
      url: `${baseUrl}/api/test`,
      expectedStatus: 200
    }
  ];
  
  log('yellow', '📋 Running Basic Tests...\n');
  
  let allPassed = true;
  
  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    const result = await testEndpoint(test.url, test.expectedStatus);
    
    if (result.success) {
      log('green', '✅ PASS');
    } else {
      log('red', `❌ FAIL - ${result.error || `HTTP ${result.status}`}`);
      allPassed = false;
    }
  }
  
  console.log('');
  
  if (allPassed) {
    log('yellow', '🧪 Testing Message Creation...\n');
    process.stdout.write('Creating test message... ');
    
    const messageResult = await testMessageCreation(baseUrl);
    
    if (messageResult.success) {
      log('green', '✅ PASS');
      console.log(`📝 Response: ${messageResult.data.substring(0, 100)}...\n`);
    } else {
      log('red', `❌ FAIL - ${messageResult.error || `HTTP ${messageResult.status}`}`);
      allPassed = false;
    }
  }
  
  console.log('');
  log('blue', '📊 Final Results');
  log('blue', '================');
  
  if (allPassed) {
    log('green', '🎉 ALL TESTS PASSED!');
    log('green', '✅ Your deployment is working perfectly!');
    console.log('');
    log('blue', '🔗 Your app is live at:');
    console.log(`   Frontend: ${baseUrl}`);
    console.log(`   API: ${baseUrl}/api`);
    console.log('');
    log('blue', '💡 Next steps:');
    console.log('   1. Test the frontend by creating a message');
    console.log('   2. Search for messages');
    console.log('   3. Verify all features work as expected');
  } else {
    log('red', '❌ Some tests failed');
    log('yellow', '🔧 Check the DigitalOcean logs for details');
    log('yellow', '📋 Common issues:');
    console.log('   - Build process failed');
    console.log('   - Environment variables not set correctly');
    console.log('   - MongoDB connection issues');
  }
}

// Get URL from command line argument
const baseUrl = process.argv[2];

if (!baseUrl) {
  log('red', '❌ Please provide the deployment URL');
  console.log('Usage: node test-fresh-deployment.js https://your-app.ondigitalocean.app');
  process.exit(1);
}

// Remove trailing slash
const cleanUrl = baseUrl.replace(/\/$/, '');

fullDeploymentTest(cleanUrl).catch(console.error);
