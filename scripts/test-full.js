#!/usr/bin/env node

/**
 * Comprehensive Test Suite for TellYouSomeday
 * Tests both frontend and backend functionality
 */

const https = require('https');
const http = require('http');

class TellYouSomedayTester {
  constructor() {
    this.results = [];
    this.backendUrl = null;
    this.frontendUrl = null;
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const startTime = Date.now();
      
      const req = client.get(url, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            url,
            status: res.statusCode,
            responseTime,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: data.trim(),
            headers: res.headers,
            contentType: res.headers['content-type']
          });
        });
      });
      
      req.on('error', (err) => {
        resolve({
          url,
          status: 0,
          responseTime: Date.now() - startTime,
          success: false,
          error: err.message
        });
      });
      
      req.setTimeout(15000, () => {
        req.destroy();
        resolve({
          url,
          status: 0,
          responseTime: 15000,
          success: false,
          error: 'Timeout'
        });
      });
    });
  }

  async testEndpoint(url, description, expectedContentType = 'application/json') {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 URL: ${url}`);
    
    const result = await this.makeRequest(url);
    
    console.log(`📊 Status: ${result.status}`);
    console.log(`⏱️  Response Time: ${result.responseTime}ms`);
    console.log(`📄 Content-Type: ${result.contentType || 'unknown'}`);
    
    if (result.success) {
      if (result.contentType && result.contentType.includes('application/json')) {
        try {
          const jsonData = JSON.parse(result.data);
          console.log(`✅ JSON Response:`, JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(`⚠️  Non-JSON response:`, result.data.substring(0, 200));
        }
      } else {
        console.log(`📝 Response preview:`, result.data.substring(0, 200));
      }
    } else {
      console.log(`❌ Error: ${result.error || 'HTTP ' + result.status}`);
    }
    
    this.results.push(result);
    return result;
  }

  async testBackend(backendUrl) {
    console.log(`\n🚀 TESTING BACKEND: ${backendUrl}`);
    console.log(`==============================================`);
    
    const endpoints = [
      { url: `${backendUrl}`, description: 'Root endpoint', type: 'json' },
      { url: `${backendUrl}/health`, description: 'Health check (backup)', type: 'json' },
      { url: `${backendUrl}/api/health`, description: 'Main health check', type: 'json' },
      { url: `${backendUrl}/api/test`, description: 'Test endpoint', type: 'json' },
      { url: `${backendUrl}/api/messages`, description: 'Messages API (GET)', type: 'json' }
    ];
    
    for (const endpoint of endpoints) {
      await this.testEndpoint(endpoint.url, endpoint.description);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async testFrontend(frontendUrl) {
    console.log(`\n🌐 TESTING FRONTEND: ${frontendUrl}`);
    console.log(`==============================================`);
    
    const endpoints = [
      { url: frontendUrl, description: 'Frontend home page', type: 'html' },
      { url: `${frontendUrl}/create`, description: 'Create page', type: 'html' },
      { url: `${frontendUrl}/search`, description: 'Search page', type: 'html' }
    ];
    
    for (const endpoint of endpoints) {
      await this.testEndpoint(endpoint.url, endpoint.description, 'text/html');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async testIntegration(backendUrl, frontendUrl) {
    console.log(`\n🔗 TESTING INTEGRATION`);
    console.log(`==============================================`);
    
    // Test CORS by checking if backend allows frontend origin
    console.log(`\n🧪 Testing CORS compatibility...`);
    console.log(`Backend: ${backendUrl}`);
    console.log(`Frontend: ${frontendUrl}`);
    
    // This would need to be done via actual browser or fetch request
    console.log(`⚠️  CORS testing requires browser environment`);
  }

  printSummary() {
    console.log(`\n📋 TEST SUMMARY`);
    console.log(`=================`);
    
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`✅ Successful: ${successful}/${total}`);
    console.log(`❌ Failed: ${total - successful}/${total}`);
    
    if (successful === total) {
      console.log(`\n🎉 All tests passed! Your TellYouSomeday deployment is ready!`);
    } else {
      console.log(`\n⚠️  Some tests failed. Check the results above.`);
    }
    
    console.log(`\n📊 Detailed Results:`);
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const time = result.responseTime;
      console.log(`${status} ${result.url} - ${result.status} (${time}ms)`);
      if (!result.success && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log(`\n🎯 Next Steps:`);
    if (successful === total) {
      console.log(`✅ Your TellYouSomeday platform is fully functional!`);
      console.log(`✅ You can now create, search, and read messages.`);
      console.log(`✅ Consider securing CORS settings in production.`);
    } else {
      console.log(`🔍 Check deployment logs for failed services.`);
      console.log(`🔍 Verify environment variables are set correctly.`);
      console.log(`🔍 Ensure MongoDB connection is working.`);
    }
  }

  async runFullTest(backendUrl, frontendUrl = null) {
    console.log(`🚀 Starting TellYouSomeday Full Test Suite`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    
    if (backendUrl) {
      await this.testBackend(backendUrl.replace(/\/$/, ''));
    }
    
    if (frontendUrl) {
      await this.testFrontend(frontendUrl.replace(/\/$/, ''));
      
      if (backendUrl) {
        await this.testIntegration(backendUrl, frontendUrl);
      }
    }
    
    this.printSummary();
  }
}

// CLI Usage
const backendUrl = process.argv[2];
const frontendUrl = process.argv[3];

if (!backendUrl) {
  console.log(`❌ Usage: node test-full.js <backend-url> [frontend-url]`);
  console.log(`   Examples:`);
  console.log(`   node test-full.js https://tellyousomeday-backend-xxxxx.ondigitalocean.app`);
  console.log(`   node test-full.js https://backend.com https://frontend.com`);
  console.log(`   node test-full.js http://localhost:5000 http://localhost:5173`);
  process.exit(1);
}

const tester = new TellYouSomedayTester();
tester.runFullTest(backendUrl, frontendUrl);
