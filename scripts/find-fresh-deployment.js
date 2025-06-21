#!/usr/bin/env node

import https from 'https';

// Common patterns for new DigitalOcean apps
const generatePossibleUrls = () => {
  const baseNames = [
    'tellyousomeday-fresh',
    'tellyousomeday',
    'fresh-tellyousomeday'
  ];
  
  const suffixes = [
    // Common 5-character patterns
    'a1b2c', 'x3y4z', 'm5n6p', 'q7r8s', 'h9j0k',
    'b2c3d', 'y4z5a', 'n6p7q', 'r8s9t', 'j0k1l',
    'c3d4e', 'z5a6b', 'p7q8r', 's9t0u', 'k1l2m',
    'd4e5f', 'a6b7c', 'q8r9s', 't0u1v', 'l2m3n',
    'e5f6g', 'b7c8d', 'r9s0t', 'u1v2w', 'm3n4o',
    // Random patterns that DO commonly appear
    'wqf7o', '4x8mv', '2k9dn', 'hdxgp', '8kj3m',
    'dfgh5', 'mnpq8', 'rstuv', 'abcde', 'fghij'
  ];
  
  const urls = [];
  
  baseNames.forEach(baseName => {
    suffixes.forEach(suffix => {
      urls.push(`https://${baseName}-${suffix}.ondigitalocean.app`);
    });
  });
  
  return urls;
};

async function quickCheck(url) {
  return new Promise((resolve) => {
    const healthUrl = `${url}/api/health`;
    
    const req = https.get(healthUrl, { timeout: 3000 }, (res) => {
      resolve({
        url,
        found: true,
        status: res.statusCode,
        working: res.statusCode === 200
      });
    });
    
    req.on('error', () => {
      resolve({ url, found: false });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, found: false });
    });
  });
}

async function findFreshDeployment() {
  console.log('🔍 Searching for your fresh DigitalOcean deployment...\n');
  
  const possibleUrls = generatePossibleUrls();
  console.log(`📊 Checking ${possibleUrls.length} possible URLs...\n`);
  
  // Check in batches of 10 to avoid overwhelming
  const batchSize = 10;
  let found = false;
  
  for (let i = 0; i < possibleUrls.length; i += batchSize) {
    const batch = possibleUrls.slice(i, i + batchSize);
    
    console.log(`Checking batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(possibleUrls.length/batchSize)}...`);
    
    const results = await Promise.all(batch.map(quickCheck));
    
    for (const result of results) {
      if (result.found) {
        const shortUrl = result.url.replace('https://', '').replace('.ondigitalocean.app', '');
        
        if (result.working) {
          console.log(`🎉 FOUND WORKING DEPLOYMENT!`);
          console.log(`📍 URL: ${result.url}`);
          console.log(`🏥 Status: ${result.status}`);
          console.log(`\n✅ Your app is ready! Test it with:`);
          console.log(`   node scripts/test-fresh-deployment.js ${result.url}`);
          return result.url;
        } else {
          console.log(`⚠️  Found app but not healthy: ${shortUrl} (HTTP ${result.status})`);
        }
        
        found = true;
      }
    }
    
    // Small delay between batches
    if (i + batchSize < possibleUrls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  if (!found) {
    console.log('\n❌ No deployment found yet.');
    console.log('\n💡 This could mean:');
    console.log('   1. Still building (check DigitalOcean dashboard)');
    console.log('   2. Build failed (check build logs)');
    console.log('   3. App created with different name');
    console.log('\n🔄 Try running this script again in a few minutes.');
  }
  
  return null;
}

async function main() {
  console.log('🚀 Fresh Deployment Finder');
  console.log('==========================\n');
  
  const deploymentUrl = await findFreshDeployment();
  
  if (deploymentUrl) {
    console.log('\n🎯 Ready for testing!');
  } else {
    console.log('\n⏳ Keep checking - your deployment might still be building...');
  }
}

main().catch(console.error);
