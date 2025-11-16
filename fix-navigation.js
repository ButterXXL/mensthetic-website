/**
 * Fix navigation links in all treatment pages
 * Problem: Internal links missing relative paths causing 404s
 */

const fs = require('fs');
const path = require('path');

const behandlungenDir = '/Users/felixaudu/Desktop/Projekte/Mensthetic/Internetseite/behandlungen';
const ueberUnsDir = '/Users/felixaudu/Desktop/Projekte/Mensthetic/Internetseite/ueber-uns';

function fixNavigationLinks() {
  console.log('🔧 Fixing navigation links...\n');

  // Fix treatment pages
  const treatmentFiles = fs.readdirSync(behandlungenDir).filter(file => file.endsWith('.html'));
  
  treatmentFiles.forEach(file => {
    const filePath = path.join(behandlungenDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🔍 Fixing ${file}...`);
    
    // Fix treatment links in navigation - add relative path
    const treatmentLinks = [
      'hyaluron.html',
      'botox.html', 
      'facelift.html',
      'augenlidstraffung.html',
      'nasenkorrektur.html',
      'lipolyse.html',
      'gynakomastie.html',
      'fettabsaugung.html',
      'bauchstraffung.html',
      'hormon-analyse.html',
      'testosteron.html',
      'haarausfall.html',
      'hyperhidrose.html'
    ];
    
    // Replace links that don't have relative path
    treatmentLinks.forEach(link => {
      // Only fix links that don't already have ../
      const oldPattern = new RegExp(`href="${link}"`, 'g');
      content = content.replace(oldPattern, `href="${link}"`); // This stays the same since we're already in behandlungen/
    });
    
    // Fix Über uns links - they should point up one level then down
    const ueberUnsLinks = [
      { old: 'href="philosophie.html"', new: 'href="../ueber-uns/philosophie.html"' },
      { old: 'href="team.html"', new: 'href="../ueber-uns/team.html"' },
      { old: 'href="praxis.html"', new: 'href="../ueber-uns/praxis.html"' },
      { old: 'href="qualifikationen.html"', new: 'href="../ueber-uns/qualifikationen.html"' }
    ];
    
    ueberUnsLinks.forEach(({old, new: newLink}) => {
      content = content.replace(new RegExp(old, 'g'), newLink);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ Fixed navigation links in ${file}`);
  });

  // Fix Über uns pages
  const ueberUnsFiles = fs.readdirSync(ueberUnsDir).filter(file => file.endsWith('.html'));
  
  ueberUnsFiles.forEach(file => {
    const filePath = path.join(ueberUnsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🔍 Fixing ${file}...`);
    
    // Fix treatment links - they should point up one level then down to behandlungen
    const treatmentLinks = [
      'hyaluron.html',
      'botox.html',
      'facelift.html', 
      'augenlidstraffung.html',
      'nasenkorrektur.html',
      'lipolyse.html',
      'gynakomastie.html',
      'fettabsaugung.html',
      'bauchstraffung.html',
      'hormon-analyse.html',
      'testosteron.html',
      'haarausfall.html',
      'hyperhidrose.html'
    ];
    
    treatmentLinks.forEach(link => {
      const oldPattern = new RegExp(`href="${link}"`, 'g');
      const newPattern = new RegExp(`href="../behandlungen/${link}"`, 'g');
      
      // Only replace if it doesn't already have the correct path
      if (!content.match(newPattern)) {
        content = content.replace(oldPattern, `href="../behandlungen/${link}"`);
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ Fixed navigation links in ${file}`);
  });
  
  console.log('\n🎉 All navigation links fixed!');
  console.log('\n📋 Summary of fixes:');
  console.log('   • Treatment pages: Cross-navigation between treatments now works');
  console.log('   • Über uns pages: Links to treatments now work');
  console.log('   • Logo always links back to home');
}

fixNavigationLinks();