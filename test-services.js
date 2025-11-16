/**
 * Mensthetic Services Pages Test
 * Focused test to check all Leistungen pages for 404 errors
 */

const { chromium } = require('playwright');
const fs = require('fs');

class ServicesPageTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.browser = null;
    this.page = null;
    this.results = {
      working: [],
      notFound: [],
      errors: []
    };
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    console.log('🚀 Testing all Leistungen pages for 404 errors...\n');
  }

  async testServicePages() {
    // All service pages that should exist
    const servicePages = [
      // Gesichtsbehandlungen
      { path: 'behandlungen/hyaluron.html', name: 'Hyaluronsäure' },
      { path: 'behandlungen/botox.html', name: 'Botox' },
      { path: 'behandlungen/facelift.html', name: 'Facelift' },
      { path: 'behandlungen/augenlidstraffung.html', name: 'Augenlidstraffung' },
      { path: 'behandlungen/nasenkorrektur.html', name: 'Nasenkorrektur' },
      
      // Körperbehandlungen
      { path: 'behandlungen/lipolyse.html', name: 'Lipolyse' },
      { path: 'behandlungen/gynakomastie.html', name: 'Gynäkomastie' },
      { path: 'behandlungen/fettabsaugung.html', name: 'Fettabsaugung' },
      { path: 'behandlungen/bauchstraffung.html', name: 'Bauchstraffung' },
      
      // Männermedizin
      { path: 'behandlungen/hormon-analyse.html', name: 'Hormon-Analyse' },
      { path: 'behandlungen/testosteron.html', name: 'Testosteron-Therapie' },
      { path: 'behandlungen/haarausfall.html', name: 'Haarausfall-Behandlung' },
      { path: 'behandlungen/hyperhidrose.html', name: 'Hyperhidrose' }
    ];

    console.log(`Testing ${servicePages.length} service pages...\n`);

    for (const service of servicePages) {
      await this.testSinglePage(service);
    }
  }

  async testSinglePage(service) {
    try {
      const url = `${this.baseUrl}/${service.path}`;
      console.log(`🔍 Testing: ${service.name} (${service.path})`);
      
      const response = await this.page.goto(url, { waitUntil: 'networkidle' });
      const statusCode = response.status();
      
      if (statusCode === 200) {
        // Check if page has actual content
        const hasTitle = await this.page.locator('h1').count() > 0;
        const hasMainContent = await this.page.locator('main').count() > 0;
        const pageTitle = await this.page.title();
        
        if (hasTitle && hasMainContent) {
          console.log(`   ✅ SUCCESS (${statusCode}) - "${pageTitle}"`);
          this.results.working.push({
            name: service.name,
            path: service.path,
            status: statusCode,
            title: pageTitle
          });
        } else {
          console.log(`   ⚠️  EMPTY PAGE (${statusCode}) - Missing content`);
          this.results.errors.push({
            name: service.name,
            path: service.path,
            status: statusCode,
            error: 'Page exists but missing content'
          });
        }
      } else if (statusCode === 404) {
        console.log(`   ❌ NOT FOUND (${statusCode}) - File does not exist`);
        this.results.notFound.push({
          name: service.name,
          path: service.path,
          status: statusCode
        });
      } else {
        console.log(`   ❌ ERROR (${statusCode}) - Unexpected response`);
        this.results.errors.push({
          name: service.name,
          path: service.path,
          status: statusCode,
          error: `HTTP ${statusCode}`
        });
      }
      
    } catch (error) {
      console.log(`   ❌ EXCEPTION - ${error.message}`);
      this.results.errors.push({
        name: service.name,
        path: service.path,
        error: error.message
      });
    }
    
    console.log(''); // Empty line for readability
  }

  async checkFileSystemForMissingPages() {
    console.log('🔍 Checking file system for missing pages...\n');
    
    const missingPages = this.results.notFound;
    
    for (const page of missingPages) {
      const filePath = `/Users/felixaudu/Desktop/Projekte/Mensthetic/Internetseite/${page.path}`;
      const exists = fs.existsSync(filePath);
      console.log(`📁 ${page.name}: ${exists ? '✅ File exists' : '❌ File missing'} - ${filePath}`);
    }
    
    console.log('');
  }

  async generateDetailedReport() {
    console.log('📊 DETAILED TEST RESULTS');
    console.log('='.repeat(60));
    
    // Working pages
    console.log(`\n✅ WORKING PAGES (${this.results.working.length}):`);
    this.results.working.forEach(page => {
      console.log(`   • ${page.name}`);
      console.log(`     Path: ${page.path}`);
      console.log(`     Title: ${page.title}`);
      console.log('');
    });
    
    // 404 Not Found pages
    if (this.results.notFound.length > 0) {
      console.log(`❌ 404 NOT FOUND PAGES (${this.results.notFound.length}):`);
      this.results.notFound.forEach(page => {
        console.log(`   • ${page.name}`);
        console.log(`     Path: ${page.path}`);
        console.log(`     Status: ${page.status}`);
        console.log('');
      });
    }
    
    // Error pages
    if (this.results.errors.length > 0) {
      console.log(`⚠️  ERROR PAGES (${this.results.errors.length}):`);
      this.results.errors.forEach(page => {
        console.log(`   • ${page.name}`);
        console.log(`     Path: ${page.path}`);
        console.log(`     Error: ${page.error}`);
        console.log('');
      });
    }
    
    // Summary
    const total = this.results.working.length + this.results.notFound.length + this.results.errors.length;
    const successRate = ((this.results.working.length / total) * 100).toFixed(1);
    
    console.log('📈 SUMMARY:');
    console.log(`   Total pages tested: ${total}`);
    console.log(`   Working: ${this.results.working.length}`);
    console.log(`   Not Found (404): ${this.results.notFound.length}`);
    console.log(`   Errors: ${this.results.errors.length}`);
    console.log(`   Success rate: ${successRate}%`);
    
    // Recommendations
    if (this.results.notFound.length > 0) {
      console.log('\n💡 RECOMMENDED ACTIONS:');
      console.log('   1. Create missing HTML files in the behandlungen/ directory');
      console.log('   2. Copy structure from working pages like hyaluron.html');
      console.log('   3. Update content for each specific treatment');
      console.log('   4. Re-run test to verify fixes');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      await this.testServicePages();
      await this.checkFileSystemForMissingPages();
      await this.generateDetailedReport();
    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test
const tester = new ServicesPageTester();
tester.run();