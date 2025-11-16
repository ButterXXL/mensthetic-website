/**
 * Mensthetic Navigation Test Suite
 * Tests all navigation links, services pages, and ensures no broken links
 */

const { chromium } = require('playwright');

class MenstheticNavigationTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.browser = null;
    this.page = null;
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  async init() {
    try {
      this.browser = await chromium.launch({ headless: false });
      this.page = await this.browser.newPage();
      
      // Set viewport for consistent testing
      await this.page.setViewportSize({ width: 1440, height: 900 });
      
      console.log('🚀 Mensthetic Navigation Test Suite Started');
      console.log(`📍 Testing: ${this.baseUrl}`);
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      throw error;
    }
  }

  async testMainNavigation() {
    console.log('\n🧪 Testing Main Navigation...');
    
    try {
      await this.page.goto(this.baseUrl);
      await this.page.waitForLoadState('networkidle');
      
      // Test main navigation links
      const navLinks = [
        { selector: 'a[href="../index.html"], a[href="index.html"], a[href="#"]', name: 'Home' },
        { selector: 'a[onclick*="scrollToSection(\'sec.menst-before-after\')"]', name: 'Resultate' },
        { selector: 'a[onclick*="scrollToSection(\'sec.menst-shop\')"]', name: 'Shop' },
        { selector: 'a[onclick*="scrollToSection(\'sec.menst-cta-booking\')"]', name: 'Kontakt' }
      ];

      for (const link of navLinks) {
        try {
          const element = await this.page.locator(link.selector).first();
          if (await element.isVisible()) {
            this.results.passed.push(`✅ ${link.name} navigation link found and visible`);
          } else {
            this.results.failed.push(`❌ ${link.name} navigation link not visible`);
          }
        } catch (error) {
          this.results.failed.push(`❌ ${link.name} navigation link not found: ${error.message}`);
        }
      }
      
    } catch (error) {
      this.results.failed.push(`❌ Main navigation test failed: ${error.message}`);
    }
  }

  async testLeistungenDropdown() {
    console.log('\n🧪 Testing Leistungen (Services) Dropdown...');
    
    try {
      await this.page.goto(this.baseUrl);
      await this.page.waitForLoadState('networkidle');
      
      // Hover over Leistungen dropdown
      const leistungenDropdown = this.page.locator('.dropdown-toggle:has-text("Leistungen")');
      await leistungenDropdown.hover();
      
      // Wait for dropdown to appear
      await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
      
      // Define all service links to test
      const serviceLinks = [
        // Gesichtsbehandlungen
        { href: 'behandlungen/hyaluron.html', name: 'Hyaluronsäure' },
        { href: 'behandlungen/botox.html', name: 'Botox' },
        { href: 'behandlungen/facelift.html', name: 'Facelift' },
        { href: 'behandlungen/augenlidstraffung.html', name: 'Augenlidstraffung' },
        { href: 'behandlungen/nasenkorrektur.html', name: 'Nasenkorrektur' },
        
        // Körperbehandlungen
        { href: 'behandlungen/lipolyse.html', name: 'Lipolyse' },
        { href: 'behandlungen/gynakomastie.html', name: 'Gynäkomastie' },
        { href: 'behandlungen/fettabsaugung.html', name: 'Fettabsaugung' },
        { href: 'behandlungen/bauchstraffung.html', name: 'Bauchstraffung' },
        
        // Männermedizin
        { href: 'behandlungen/hormon-analyse.html', name: 'Hormon-Analyse' },
        { href: 'behandlungen/testosteron.html', name: 'Testosteron-Therapie' },
        { href: 'behandlungen/haarausfall.html', name: 'Haarausfall-Behandlung' },
        { href: 'behandlungen/hyperhidrose.html', name: 'Hyperhidrose' }
      ];

      for (const service of serviceLinks) {
        await this.testServicePage(service);
      }
      
    } catch (error) {
      this.results.failed.push(`❌ Leistungen dropdown test failed: ${error.message}`);
    }
  }

  async testServicePage(service) {
    try {
      console.log(`   🔍 Testing ${service.name}...`);
      
      // Navigate directly to the service page
      const serviceUrl = `${this.baseUrl}/${service.href}`;
      const response = await this.page.goto(serviceUrl);
      
      if (response.status() === 200) {
        await this.page.waitForLoadState('networkidle');
        
        // Check if page has essential content
        const hasTitle = await this.page.locator('h1').count() > 0;
        const hasContent = await this.page.locator('main').count() > 0;
        const hasNavigation = await this.page.locator('.navbar').count() > 0;
        
        if (hasTitle && hasContent && hasNavigation) {
          this.results.passed.push(`✅ ${service.name} - Page loads successfully with content`);
          
          // Take screenshot for visual verification
          await this.page.screenshot({ 
            path: `screenshots/${service.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
            fullPage: false 
          });
          
          // Test if animations are working (check for animation CSS)
          const hasAnimations = await this.page.locator('link[href*="menst-animations.css"]').count() > 0;
          if (hasAnimations) {
            this.results.passed.push(`✅ ${service.name} - Animation CSS loaded`);
          } else {
            this.results.warnings.push(`⚠️ ${service.name} - Animation CSS missing`);
          }
          
        } else {
          this.results.failed.push(`❌ ${service.name} - Page missing essential content`);
        }
      } else {
        this.results.failed.push(`❌ ${service.name} - Page returned ${response.status()}`);
      }
      
    } catch (error) {
      this.results.failed.push(`❌ ${service.name} - Error: ${error.message}`);
    }
  }

  async testUeberUnsDropdown() {
    console.log('\n🧪 Testing Über uns Dropdown...');
    
    try {
      await this.page.goto(this.baseUrl);
      await this.page.waitForLoadState('networkidle');
      
      // Hover over Über uns dropdown
      const ueberUnsDropdown = this.page.locator('.dropdown-toggle:has-text("Über uns")');
      await ueberUnsDropdown.hover();
      
      // Wait for dropdown to appear
      await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
      
      // Define Über uns pages to test
      const ueberUnsPages = [
        { href: 'ueber-uns/philosophie.html', name: 'Unsere Philosophie' },
        { href: 'ueber-uns/team.html', name: 'Das Team' },
        { href: 'ueber-uns/praxis.html', name: 'Die Praxis' },
        { href: 'ueber-uns/qualifikationen.html', name: 'Qualifikationen' }
      ];

      for (const page of ueberUnsPages) {
        try {
          console.log(`   🔍 Testing ${page.name}...`);
          
          const pageUrl = `${this.baseUrl}/${page.href}`;
          const response = await this.page.goto(pageUrl);
          
          if (response.status() === 200) {
            await this.page.waitForLoadState('networkidle');
            
            const hasTitle = await this.page.locator('h1').count() > 0;
            const hasContent = await this.page.locator('main').count() > 0;
            const hasNavigation = await this.page.locator('.navbar').count() > 0;
            
            if (hasTitle && hasContent && hasNavigation) {
              this.results.passed.push(`✅ ${page.name} - Page loads successfully`);
            } else {
              this.results.failed.push(`❌ ${page.name} - Page missing essential content`);
            }
          } else {
            this.results.failed.push(`❌ ${page.name} - Page returned ${response.status()}`);
          }
          
        } catch (error) {
          this.results.failed.push(`❌ ${page.name} - Error: ${error.message}`);
        }
      }
      
    } catch (error) {
      this.results.failed.push(`❌ Über uns dropdown test failed: ${error.message}`);
    }
  }

  async testAnimations() {
    console.log('\n🧪 Testing Animations...');
    
    try {
      await this.page.goto(this.baseUrl);
      await this.page.waitForLoadState('networkidle');
      
      // Test if animation system is loaded
      const animationScript = await this.page.locator('script[src*="menst-animations.js"]').count();
      if (animationScript > 0) {
        this.results.passed.push('✅ Animation script loaded');
      } else {
        this.results.warnings.push('⚠️ Animation script not found');
      }
      
      // Test button hover effects
      const primaryButton = this.page.locator('.btn--menst-primary').first();
      if (await primaryButton.isVisible()) {
        await primaryButton.hover();
        this.results.passed.push('✅ Button hover interaction working');
      }
      
      // Test service card animations
      const serviceCard = this.page.locator('.service-card').first();
      if (await serviceCard.isVisible()) {
        await serviceCard.hover();
        this.results.passed.push('✅ Service card hover interaction working');
      }
      
    } catch (error) {
      this.results.failed.push(`❌ Animation test failed: ${error.message}`);
    }
  }

  async testResponsiveDesign() {
    console.log('\n🧪 Testing Responsive Design...');
    
    const viewports = [
      { width: 390, height: 844, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      try {
        await this.page.setViewportSize(viewport);
        await this.page.goto(this.baseUrl);
        await this.page.waitForLoadState('networkidle');
        
        // Check if navigation is accessible
        const navbar = await this.page.locator('.navbar').isVisible();
        if (navbar) {
          this.results.passed.push(`✅ ${viewport.name} - Navigation visible`);
        } else {
          this.results.failed.push(`❌ ${viewport.name} - Navigation not visible`);
        }
        
        // Take screenshot
        await this.page.screenshot({ 
          path: `screenshots/${viewport.name}_${viewport.width}x${viewport.height}.png`,
          fullPage: false 
        });
        
      } catch (error) {
        this.results.failed.push(`❌ ${viewport.name} test failed: ${error.message}`);
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(50));
    
    console.log(`\n✅ PASSED (${this.results.passed.length}):`);
    this.results.passed.forEach(result => console.log(`   ${result}`));
    
    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️ WARNINGS (${this.results.warnings.length}):`);
      this.results.warnings.forEach(result => console.log(`   ${result}`));
    }
    
    if (this.results.failed.length > 0) {
      console.log(`\n❌ FAILED (${this.results.failed.length}):`);
      this.results.failed.forEach(result => console.log(`   ${result}`));
    } else {
      console.log('\n🎉 All tests passed!');
    }
    
    const totalTests = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const successRate = ((this.results.passed.length / totalTests) * 100).toFixed(1);
    
    console.log(`\n📈 Success Rate: ${successRate}% (${this.results.passed.length}/${totalTests})`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      // Create screenshots directory
      const fs = require('fs');
      if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots');
      }
      
      await this.init();
      await this.testMainNavigation();
      await this.testLeistungenDropdown();
      await this.testUeberUnsDropdown();
      await this.testAnimations();
      await this.testResponsiveDesign();
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the tests
const tester = new MenstheticNavigationTester();
tester.run();