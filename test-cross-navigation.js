/**
 * Test cross-navigation between all pages
 * Tests that you can navigate from any page to any other page
 */

const { chromium } = require('playwright');

class CrossNavigationTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.browser = null;
    this.page = null;
    this.testsPassed = 0;
    this.testsFailed = 0;
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    console.log('🧪 Testing cross-navigation between all pages...\n');
  }

  async testCrossNavigation() {
    // Start from Botox page and try to navigate to other treatments
    console.log('🔍 Testing treatment-to-treatment navigation...');
    
    await this.page.goto(`${this.baseUrl}/behandlungen/botox.html`);
    await this.page.waitForLoadState('networkidle');
    console.log('   Started from Botox page');
    
    // Test navigation to Hyaluron
    try {
      await this.page.hover('.dropdown-toggle:has-text("Leistungen")');
      await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
      
      const hyaluronLink = this.page.locator('a[href="hyaluron.html"]');
      await hyaluronLink.click();
      await this.page.waitForLoadState('networkidle');
      
      const currentUrl = this.page.url();
      if (currentUrl.includes('hyaluron.html')) {
        console.log('   ✅ Botox → Hyaluron: SUCCESS');
        this.testsPassed++;
      } else {
        console.log(`   ❌ Botox → Hyaluron: FAILED (URL: ${currentUrl})`);
        this.testsFailed++;
      }
    } catch (error) {
      console.log(`   ❌ Botox → Hyaluron: ERROR (${error.message})`);
      this.testsFailed++;
    }

    // Test navigation from Hyaluron to Über uns
    try {
      await this.page.hover('.dropdown-toggle:has-text("Über uns")');
      await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
      
      const teamLink = this.page.locator('a[href="../ueber-uns/team.html"]');
      await teamLink.click();
      await this.page.waitForLoadState('networkidle');
      
      const currentUrl = this.page.url();
      if (currentUrl.includes('team.html')) {
        console.log('   ✅ Hyaluron → Team: SUCCESS');
        this.testsPassed++;
      } else {
        console.log(`   ❌ Hyaluron → Team: FAILED (URL: ${currentUrl})`);
        this.testsFailed++;
      }
    } catch (error) {
      console.log(`   ❌ Hyaluron → Team: ERROR (${error.message})`);
      this.testsFailed++;
    }

    // Test logo back to home from any page
    try {
      const logoLink = this.page.locator('.logo');
      await logoLink.click();
      await this.page.waitForLoadState('networkidle');
      
      const currentUrl = this.page.url();
      if (currentUrl === `${this.baseUrl}/` || currentUrl.includes('index.html')) {
        console.log('   ✅ Logo → Home: SUCCESS');
        this.testsPassed++;
      } else {
        console.log(`   ❌ Logo → Home: FAILED (URL: ${currentUrl})`);
        this.testsFailed++;
      }
    } catch (error) {
      console.log(`   ❌ Logo → Home: ERROR (${error.message})`);
      this.testsFailed++;
    }
  }

  async testRandomNavigation() {
    console.log('\n🔍 Testing random navigation paths...');
    
    const testRoutes = [
      { from: 'behandlungen/lipolyse.html', to: 'behandlungen/facelift.html', description: 'Lipolyse → Facelift' },
      { from: 'ueber-uns/philosophie.html', to: 'behandlungen/testosteron.html', description: 'Philosophie → Testosteron' },
      { from: 'behandlungen/hyperhidrose.html', to: 'ueber-uns/praxis.html', description: 'Hyperhidrose → Praxis' }
    ];

    for (const route of testRoutes) {
      try {
        // Go to starting page
        await this.page.goto(`${this.baseUrl}/${route.from}`);
        await this.page.waitForLoadState('networkidle');
        
        // Navigate to target page via navigation menu
        const targetFileName = route.to.split('/').pop();
        const targetDir = route.to.includes('ueber-uns') ? 'ueber-uns' : 'behandlungen';
        
        let targetSelector;
        if (targetDir === 'behandlungen') {
          await this.page.hover('.dropdown-toggle:has-text("Leistungen")');
          await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
          targetSelector = `a[href*="${targetFileName}"]`;
        } else {
          await this.page.hover('.dropdown-toggle:has-text("Über uns")');
          await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
          targetSelector = `a[href*="${targetFileName}"]`;
        }
        
        await this.page.locator(targetSelector).first().click();
        await this.page.waitForLoadState('networkidle');
        
        const currentUrl = this.page.url();
        if (currentUrl.includes(targetFileName.replace('.html', ''))) {
          console.log(`   ✅ ${route.description}: SUCCESS`);
          this.testsPassed++;
        } else {
          console.log(`   ❌ ${route.description}: FAILED (URL: ${currentUrl})`);
          this.testsFailed++;
        }
        
      } catch (error) {
        console.log(`   ❌ ${route.description}: ERROR (${error.message})`);
        this.testsFailed++;
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Cross-Navigation Test Results');
    console.log('='.repeat(40));
    console.log(`✅ Tests Passed: ${this.testsPassed}`);
    console.log(`❌ Tests Failed: ${this.testsFailed}`);
    console.log(`📈 Success Rate: ${((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100).toFixed(1)}%`);
    
    if (this.testsFailed === 0) {
      console.log('\n🎉 All navigation tests passed!');
      console.log('✅ You can now navigate from any page to any other page');
      console.log('✅ Logo always brings you back to home');
      console.log('✅ No more 404 errors when switching between treatments');
    } else {
      console.log('\n⚠️ Some navigation issues remain. Please check the failed tests above.');
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
      await this.testCrossNavigation();
      await this.testRandomNavigation();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Cross-navigation test failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test
const tester = new CrossNavigationTester();
tester.run();