#!/usr/bin/env node

/**
 * Quick Deploy Script for TellYouSomeday
 * Helps with the deployment process
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🚀 TellYouSomeday Deployment Helper
==================================

CURRENT ISSUE:
- Frontend is deployed at: tellyousomeday-5r77f.ondigitalocean.app
- Backend is NOT deployed yet
- Frontend is trying to call non-existent backend API

SOLUTION STEPS:
`);

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('1. Deploy Backend First');
  console.log('   - Go to DigitalOcean Apps Dashboard');
  console.log('   - Create NEW app (separate from frontend)');
  console.log('   - Use .do/backend-app.yaml configuration');
  console.log('');
  
  const backendUrl = await askQuestion('2. What is your backend URL after deployment? (e.g., https://tellyousomeday-backend-xxxxx.ondigitalocean.app): ');
  
  if (backendUrl && backendUrl.includes('ondigitalocean.app')) {
    console.log(`\n3. Updating configuration files with: ${backendUrl}`);
    
    // This would update the .env.production file
    console.log(`\nYou need to manually update .env.production with:`);
    console.log(`VITE_API_URL=${backendUrl}/api`);
    console.log(`\nThen run:`);
    console.log(`git add .`);
    console.log(`git commit -m "Update frontend to use deployed backend URL"`);
    console.log(`git push origin main`);
    console.log(`\n4. Redeploy your frontend app on DigitalOcean`);
    
    console.log(`\n5. Test the connection:`);
    console.log(`curl ${backendUrl}/api/health`);
    
  } else {
    console.log('\n❌ Please deploy the backend first and get the actual URL.');
  }
  
  rl.close();
}

main().catch(console.error);
