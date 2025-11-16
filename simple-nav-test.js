/**
 * Simple navigation test to debug the issue
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🧪 Simple Navigation Test');
  
  // Test 1: Go to Botox page
  console.log('\n1. Going to Botox page...');
  await page.goto('http://localhost:3000/behandlungen/botox.html');
  await page.waitForLoadState('networkidle');
  console.log(`   Current URL: ${page.url()}`);
  
  // Test 2: Click on Hyaluron in dropdown
  console.log('\n2. Hovering over Leistungen dropdown...');
  await page.hover('.dropdown-toggle:has-text("Leistungen")');
  await page.waitForTimeout(1000); // Wait a bit
  
  console.log('3. Looking for Hyaluron link...');
  const hyaluronLinks = await page.locator('a:has-text("Hyaluronsäure")').all();
  console.log(`   Found ${hyaluronLinks.length} Hyaluron links`);
  
  for (let i = 0; i < hyaluronLinks.length; i++) {
    const href = await hyaluronLinks[i].getAttribute('href');
    const isVisible = await hyaluronLinks[i].isVisible();
    console.log(`   Link ${i + 1}: href="${href}", visible=${isVisible}`);
  }
  
  console.log('\n4. Clicking first visible Hyaluron link...');
  try {
    await page.locator('a:has-text("Hyaluronsäure")').first().click();
    await page.waitForLoadState('networkidle');
    console.log(`   Success! New URL: ${page.url()}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 3: Logo back to home
  console.log('\n5. Testing logo back to home...');
  try {
    await page.locator('.logo').click();
    await page.waitForLoadState('networkidle');
    console.log(`   Success! Back to: ${page.url()}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  await browser.close();
  console.log('\n✅ Test completed');
})();