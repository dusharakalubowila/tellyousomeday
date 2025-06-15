#!/usr/bin/env node

/**
 * Deployment Test Script for TellYouSomeday
 * Tests backend API endpoints to verify deployment
 */

const https = require('https');
const http = require('http');

class DeploymentTester {
  constructor() {
    this.results = [];
  }

  async testEndpoint(url, description) {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 URL: ${url}`);
    
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const startTime = Date.now();
      
      const req = client.get(url, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const result = {
            url,
            status: res.statusCode,
            responseTime,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: data.trim(),
            headers: res.headers
          };
          
          console.log(`📊 Status: ${res.statusCode}`);
          console.log(`⏱️  Response Time: ${responseTime}ms`);
          console.log(`📄 Content-Type: ${res.headers['content-type']}`);
          
          try {
            const jsonData = JSON.parse(data);
            console.log(`✅ JSON Response:`, jsonData);
          } catch (e) {
            console.log(`📝 Raw Response:`, data.substring(0, 200));
          }
          
          this.results.push(result);
          resolve(result);
        });
      });
      
      req.on('error', (err) => {
        console.log(`❌ Error: ${err.message}`);
        const result = {
          url,
          status: 0,
          responseTime: Date.now() - startTime,
          success: false,
          error: err.message
        };
        this.results.push(result);
        resolve(result);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        console.log(`⏰ Request timeout after 10 seconds`);
        const result = {
          url,
          status: 0,
          responseTime: 10000,
          success: false,
          error: 'Timeout'
        };
        this.results.push(result);
        resolve(result);
      });
    });
  }

  async runTests(backendUrl) {
    console.log(`🚀 Starting deployment tests for: ${backendUrl}`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    
    const endpoints = [
      { url: `${backendUrl}`, description: 'Root endpoint' },
      { url: `${backendUrl}/health`, description: 'Health check (backup)' },
      { url: `${backendUrl}/api/health`, description: 'Main health check' },
      { url: `${backendUrl}/api/test`, description: 'Test endpoint' },
      { url: `${backendUrl}/api/messages`, description: 'Messages API (GET)' }
    ];
    
    for (const endpoint of endpoints) {
      await this.testEndpoint(endpoint.url, endpoint.description);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log(`\n📋 TEST SUMMARY`);
    console.log(`=================`);
    
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`✅ Successful: ${successful}/${total}`);
    console.log(`❌ Failed: ${total - successful}/${total}`);
    
    if (successful === total) {
      console.log(`\n🎉 All tests passed! Backend is ready.`);
    } else {
      console.log(`\n⚠️  Some tests failed. Check the results above.`);
    }
    
    console.log(`\n📊 Results:`);
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.url} - ${result.status} (${result.responseTime}ms)`);
    });
  }
}

// Run tests
const backendUrl = process.argv[2];
if (!backendUrl) {
  console.log(`❌ Usage: node test-deployment.js <backend-url>`);
  console.log(`   Example: node test-deployment.js https://tellyousomeday-backend-xxxxx.ondigitalocean.app`);
  process.exit(1);
}

const tester = new DeploymentTester();
tester.runTests(backendUrl.replace(/\/$/, '')); // Remove trailing slash
